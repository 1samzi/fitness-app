'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Spinner,
  Avatar,
  useToast,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  Card,
  CardHeader,
  CardBody,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { jwtDecode } from 'jwt-decode'
import NavBar from '../NavBar'

function Profile() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const decodedToken = jwtDecode(token)
      const userId = decodedToken._id

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
      setEditedUser(data.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load user profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser(user)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUser(prev => ({ ...prev, [name]: value }))
  }

  const handleUnitChange = (field, newUnit) => {
    setEditedUser((prevData) => {
      const oldUnit = prevData[`${field}Unit`]
      const oldValue = prevData[field]
      let newValue = oldValue

      if (oldValue) {
        if (field === 'height') {
          newValue = newUnit === 'cm' 
            ? (parseFloat(oldValue) * 2.54).toFixed(2) 
            : (parseFloat(oldValue) / 2.54).toFixed(2)
        } else if (field === 'weight') {
          newValue = newUnit === 'kg' 
            ? (parseFloat(oldValue) / 2.2046).toFixed(2) 
            : (parseFloat(oldValue) * 2.2046).toFixed(2)
        }
      }

      return {
        ...prevData,
        [`${field}Unit`]: newUnit,
        [field]: newValue,
      }
    })
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/user/updateUser/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      })

      if (!response.ok) {
        throw new Error('Failed to update user data')
      }

      const updatedUser = await response.json()
      setUser(updatedUser.data)
      setIsEditing(false)
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      window.location.reload() // Refresh the page
    } catch (error) {
      console.error('Error updating user data:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (isLoading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    )
  }

  if (!user) {
    return (
      <Container centerContent>
        <Text>User not found</Text>
      </Container>
    )
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <NavBar />
      <Container maxW="container.md" py={10}>
        <Card>
          <CardHeader>
            <Heading as="h1" size="xl" textAlign="center" color="blue.600">
              User Profile
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <HStack justifyContent="center">
                <Avatar size="2xl" name={`${user.firstName} ${user.lastName}`} />
              </HStack>
              <SimpleGrid columns={[1, null, 2]} spacing={6}>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name="firstName"
                    value={isEditing ? editedUser.firstName : user.firstName}
                    onChange={handleChange}
                    isReadOnly={!isEditing}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="lastName"
                    value={isEditing ? editedUser.lastName : user.lastName}
                    onChange={handleChange}
                    isReadOnly={!isEditing}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Sex</FormLabel>
                  {isEditing ? (
                    <Select name="sex" value={editedUser.sex} onChange={handleChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  ) : (
                    <Input value={user.sex} isReadOnly />
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    isReadOnly
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Height</FormLabel>
                  <InputGroup>
                    <Input
                      name="height"
                      value={isEditing ? editedUser.height : user.height}
                      onChange={handleChange}
                      type="number"
                      isReadOnly={!isEditing}
                    />
                    <InputRightElement width="4.5rem">
                      {isEditing ? (
                        <Select 
                          value={editedUser.heightUnit} 
                          onChange={(e) => handleUnitChange('height', e.target.value)} 
                          size="sm"
                        >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </Select>
                      ) : (
                        <Box pr={2}>{user.heightUnit}</Box>
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Weight</FormLabel>
                  <InputGroup>
                    <Input
                      name="weight"
                      value={isEditing ? editedUser.weight : user.weight}
                      onChange={handleChange}
                      type="number"
                      isReadOnly={!isEditing}
                    />
                    <InputRightElement width="4.5rem">
                      {isEditing ? (
                        <Select 
                          value={editedUser.weightUnit} 
                          onChange={(e) => handleUnitChange('weight', e.target.value)} 
                          size="sm"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </Select>
                      ) : (
                        <Box pr={2}>{user.weightUnit}</Box>
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={user.email} isReadOnly />
              </FormControl>
              <Box>
                <Text fontWeight="bold">Member since: {new Date(user.createdAt).toLocaleDateString()}</Text>
              </Box>
              <HStack justifyContent="center" spacing={4}>
                {isEditing ? (
                  <>
                    <Button colorScheme="blue" onClick={handleSubmit}>Save Changes</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </>
                ) : (
                  <Button colorScheme="blue" onClick={handleEdit}>Edit Profile</Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}

export default Profile