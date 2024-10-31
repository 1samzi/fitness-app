import React, { useState } from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Divider,
  HStack,
  Avatar,
  useColorModeValue,
  Container,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react'

function UserActivity() {
  const [newPassword, setNewPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const toast = useToast()
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const cardBgColor = useColorModeValue('white', 'gray.700')

  // Simulated user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2023-01-15',
    lastLogin: '2023-05-20',
  }

  // Simulated feedback data
  const feedbackData = [
    {
      id: 1,
      message: 'The new feature is great!',
      response: "Thank you for your feedback. We're glad you like it!",
    },
    {
      id: 2,
      message: "I'm having trouble with the search function.",
      response: null,
    },
  ]

  const handleResetPassword = (e) => {
    e.preventDefault()
    // Simulated password reset logic
    toast({
      title: 'Password Reset',
      description: 'Your password has been successfully reset.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    setNewPassword('')
  }

  const handleSubmitFeedback = (e) => {
    e.preventDefault()
    // Simulated feedback submission logic
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your feedback!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    setFeedback('')
  }

  const handleRespondToFeedback = (id) => {
    // Simulated response submission logic
    toast({
      title: 'Response Sent',
      description: 'Your response has been sent to the user.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={5}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl">User Activity</Heading>

          {/* User Data Section */}
          <Card bg={cardBgColor}>
            <CardHeader>
              <Heading size="md">User Data</Heading>
            </CardHeader>
            <CardBody>
              <HStack spacing={4}>
                <Avatar name={userData.name} size="xl" />
                <VStack align="start" spacing={2}>
                  <Text><strong>Name:</strong> {userData.name}</Text>
                  <Text><strong>Email:</strong> {userData.email}</Text>
                  <Text><strong>Join Date:</strong> {userData.joinDate}</Text>
                  <Text><strong>Last Login:</strong> {userData.lastLogin}</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Reset Password Section */}
          <Card bg={cardBgColor}>
            <CardHeader>
              <Heading size="md">Reset Password</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleResetPassword}>
                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </FormControl>
                <Button mt={4} colorScheme="blue" type="submit">
                  Reset Password
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Feedback Section */}
          {/* <Card bg={cardBgColor}>
            <CardHeader>
              <Heading size="md">Feedback</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <form onSubmit={handleSubmitFeedback}>
                  <FormControl>
                    <FormLabel>Submit Feedback</FormLabel>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Enter your feedback here"
                    />
                  </FormControl>
                  <Button mt={4} colorScheme="blue" type="submit">
                    Submit Feedback
                  </Button>
                </form>
                <Divider />
                <Heading size="sm">Previous Feedback</Heading>
                {feedbackData.map((item) => (
                  <Box key={item.id} p={4} borderWidth={1} borderRadius="md">
                    <Text fontWeight="bold">User Feedback:</Text>
                    <Text mb={2}>{item.message}</Text>
                    {item.response ? (
                      <>
                        <Text fontWeight="bold">Admin Response:</Text>
                        <Text>{item.response}</Text>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleRespondToFeedback(item.id)}
                      >
                        Respond
                      </Button>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card> */}
        </VStack>
      </Container>
    </Box>
  )
}

export default UserActivity