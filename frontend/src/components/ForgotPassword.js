import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  useColorModeValue
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          title: "Reset link sent",
          description: "If an account exists with this email, you will receive a password reset link.",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
        setEmail('')
        navigate('/login')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send reset link')
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: error instanceof Error ? error.message : "Unable to send reset link. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="lg" py={12}>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={6}>
          <Heading as="h1" size="xl">
            Forgot Password
          </Heading>
          <Text>Enter your email address to receive a password reset link.</Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              isLoading={isLoading}
              type="submit"
              width="full"
            >
              Send Reset Link
            </Button>
          </form>
        </VStack>
      </Box>
    </Container>
  )
}

export default ForgotPassword