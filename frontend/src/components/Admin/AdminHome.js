'use client'

import React from 'react'
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
} from '@chakra-ui/react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const userData = [
    {
        "User":"John Doe",
        "Action":"Created a new post",
        "Time":"2 minutes ago"
    },
    {
        "User":"John Doe",
        "Action":"Created a new post",
        "Time":"2 minutes ago"
    },
    {
        "User":"John Doe",
        "Action":"Created a new post",
        "Time":"2 minutes ago"
    },
]

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
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const navigate = useNavigate();

  const onViewClick = () => {
    navigate('/user-activity')
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
            stat={'5,000'}
            helpText={'23% increase'}
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
            Recent Activity
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Action</Th>
                <Th>Time</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
            {userData.map((data) => (
              <Tr>
                <Td>{data.User}</Td>
                <Td>{data.Action}</Td>
                <Td>{data.Time}</Td>
                <Td>
                    <Button onClick={onViewClick}>View</Button>
                </Td>
              </Tr>
              )) }
            </Tbody>
          </Table>
        </Box>
      </Container>
    </Box>
  )
}

export default AdminHome