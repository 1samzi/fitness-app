import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Flex,
  Text,
  useToast,
} from '@chakra-ui/react'
import { MoreVertical, User, LogOut } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

export default function ProfileMenu() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const toast = useToast()

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      setUser(JSON.parse(storedUserData))
    } else {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          fetchUserData(decodedToken._id, token)
        } catch (error) {
          console.error('Error decoding token:', error)
          toast({
            title: "Authentication Error",
            description: "Please log in again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          })
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    }
  }, [navigate, toast])

  const fetchUserData = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/getUserById/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      setUser(data.data)
      localStorage.setItem('userData', JSON.stringify(data.data))
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const onSignOutClick = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    navigate('/login')
    toast({
      title: "Signed Out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const onProfileClick = () => {
    navigate('/profile')
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <Flex alignItems="center" gap={2}>
      <Avatar 
        name={`${user.firstName} ${user.lastName}`} 
        size="sm"
        bg="blue.500"
        color="white"
      />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<MoreVertical size={20} />}
          variant="ghost"
          size="sm"
        />
        <MenuList>
          <MenuItem icon={<User size={16} />} onClick={onProfileClick}>
            Profile
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<LogOut size={16} />} onClick={onSignOutClick}>
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}