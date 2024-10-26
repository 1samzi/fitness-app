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
  const navigation = useNavigate()

  const handleSubmit = async () => {
    // e.preventDefault()
    // setIsLoading(true)

    // // Here you would typically call your API to handle the password reset
    // // This is a mock API call
    // try {
    //   await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
    //   toast({
    //     title: "Reset link sent",
    //     description: "If an account exists with this email, you will receive a password reset link.",
    //     status: "success",
    //     duration: 5000,
    //     isClosable: true,
    //   })
    //   setEmail('')
    // } catch (error) {
    //   toast({
    //     title: "An error occurred",
    //     description: "Unable to send reset link. Please try again later.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //   })
    // } finally {
    //   setIsLoading(false)
    // }
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