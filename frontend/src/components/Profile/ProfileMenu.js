import React, { useEffect, useState } from 'react'
import {
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Button,
  useToast,
} from '@chakra-ui/react'
import { MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function ProfileMenu() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  const onSignOutClick = () => {
    localStorage.removeItem("token");
    navigate('/login')
  }

  const onProfileClick = () => {
    navigate('/profile')
  }
  
  return (
    <Flex alignItems={'center'} gap={2}>
      <Avatar
        size={'md'}
        src={
          'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
        }
        // name={`${user.firstName} ${user.lastName}`}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label={'More options'}
          icon={<MoreVertical size={20} />}
          variant={'ghost'}
          size={'sm'}
        />
        <MenuList>
          <MenuItem onClick={onProfileClick}>Profile</MenuItem>
          <MenuDivider />
          <MenuItem onClick={onSignOutClick}>Sign out</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default ProfileMenu