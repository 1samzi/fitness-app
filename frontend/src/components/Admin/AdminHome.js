'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  useColorModeValue,
  Button,
  useToast,
} from '@chakra-ui/react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function StatCard({ title, stat, helpText, type }) {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {stat}
      </StatNumber>
      <StatHelpText>
        {type === 'increase' ? (
          <TrendingUp color="green" size={16} />
        ) : (
          <TrendingDown color="red" size={16} />
        )}{' '}
        {helpText}
      </StatHelpText>
    </Stat>
  )
}

function AdminHome() {
  const [userData, setUserData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token') // Get token from local storage
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('http://localhost:3001/api/user/get-user', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in request headers
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      setUserData(data.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch user data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  const onViewClick = (userId) => {
    navigate(`/user-activity/${userId}`)
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={5}>
        <Heading as="h1" size="xl" mb={6} color={textColor}>
          Admin Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          <StatCard
            title={'Total Users'}
            stat={userData.length}
            helpText={'Total registered users'}
            type={'increase'}
          />
          <StatCard
            title={'Revenue'}
            stat={'$34,000'}
            helpText={'8% increase'}
            type={'increase'}
          />
          <StatCard
            title={'Bounce Rate'}
            stat={'27%'}
            helpText={'3% decrease'}
            type={'decrease'}
          />
        </SimpleGrid>

        <Box
          mt={8}
          bg={useColorModeValue('white', 'gray.700')}
          shadow="base"
          rounded="lg"
          p={5}
        >
          <Heading as="h2" size="lg" mb={4}>
            User Data
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Age</Th>
                <Th>Height</Th>
                <Th>Weight</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={6}>Loading...</Td>
                </Tr>
              ) : (
                userData.map((user) => (
                  <Tr key={user._id}>
                    <Td>{`${user.firstName} ${user.lastName}`}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.age}</Td>
                    <Td>{`${user.height} ${user.heightUnit}`}</Td>
                    <Td>{`${user.weight} ${user.weightUnit}`}</Td>
                    <Td>
                      <Button onClick={() => onViewClick(user._id)}>View</Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </Box>
  )
}

export default AdminHome