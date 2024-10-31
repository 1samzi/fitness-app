import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  PinInput,
  PinInputField,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function TwoFactorAuth() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    }
  }, [timeLeft])

  const handleSubmit = async () => {
    navigate('/admin-home')
    // e.preventDefault()
    // setIsLoading(true)

    // // Here you would typically call your API to verify the 2FA code
    // // This is a mock API call
    // try {
    //   await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
    //   if (code === '123456') { // In a real scenario, this would be verified server-side
    //     toast({
    //       title: "Authentication successful",
    //       description: "You have been successfully authenticated.",
    //       status: "success",
    //       duration: 5000,
    //       isClosable: true,
    //     })
    //   } else {
    //     throw new Error('Invalid code')
    //   }
    // } catch (error) {
    //   toast({
    //     title: "Authentication failed",
    //     description: "The code you entered is incorrect. Please try again.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //   })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const handleResendCode = () => {
    setTimeLeft(30)
    toast({
      title: "Code resent",
      description: "A new authentication code has been sent to your device.",
      status: "info",
      duration: 5000,
      isClosable: true,
    })
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
            Two-Factor Authentication
          </Heading>
          <Text>Enter the 6-digit code sent to your device.</Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <FormControl id="2fa-code" isRequired>
              <FormLabel>Authentication Code</FormLabel>
              <HStack justifyContent="center">
                <PinInput
                  otp
                  size="lg"
                  value={code}
                  onChange={(value) => setCode(value)}
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              isLoading={isLoading}
              type="submit"
              width="full"
              isDisabled={code.length !== 6}
            >
              Verify
            </Button>
          </form>
          <Text>
            Didn't receive a code?{' '}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={handleResendCode}
              isDisabled={timeLeft > 0}
            >
              Resend
            </Button>
            {timeLeft > 0 && ` (${timeLeft}s)`}
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}

export default TwoFactorAuth