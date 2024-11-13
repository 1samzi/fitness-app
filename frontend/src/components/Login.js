import React, { useState, useRef } from 'react'
import {
    Box,
    Button,
    Center,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Text,
    useToast,
    HStack,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const toast = useToast()
    const navigate = useNavigate()
    const toastIdRef = useRef()

    const handleClick = () => setShow(!show)

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            setEmailError('Email is required')
            return false
        }
        if (!re.test(email)) {
            setEmailError('Invalid email format')
            return false
        }
        setEmailError('')
        return true
    }

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('Password is required')
            return false
        }
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters')
            return false
        }
        setPasswordError('')
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const isEmailValid = validateEmail(email)
        const isPasswordValid = validatePassword(password)

        if (isEmailValid && isPasswordValid) {
            toastIdRef.current = toast({
                title: "Login Attempt",
                description: "Attempting to log in...",
                status: "info",
                duration: null,
                isClosable: false,
            })

            try {
                const response = await fetch('http://localhost:3001/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                })

                if (toast.isActive(toastIdRef.current)) {
                    toast.close(toastIdRef.current)
                }
                if (response.ok) {
                    const data = await response.json()
                    localStorage.setItem("token", data.data.token)
                    toast({
                        title: "Login Successful",
                        description: "You have successfully logged in.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                    if (data.data.userData.userType === "admin") {
                        // Generate OTP for admin users
                        const otpResponse = await fetch('http://localhost:3001/api/auth/generate-otp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email }),
                        })

                        if (otpResponse.ok) {
                            toast({
                                title: "OTP Sent",
                                description: "An OTP has been sent to your email for verification.",
                                status: "info",
                                duration: 3000,
                                isClosable: true,
                            })
                            navigate('/two-factor-auth', { state: { email } })
                        } else {
                            throw new Error('Failed to generate OTP')
                        }
                    } else {
                        navigate('/home')
                    }
                } else {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Login failed')
                }
            } catch (error) {
                toast({
                    title: "Login Failed",
                    description: error instanceof Error ? error.message : "An error occurred during login.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
        } else {
            toast({
                title: "Invalid Input",
                description: "Please check your email and password.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return (
        <Container maxW="md" centerContent>
            <Box w="100%" p={8} mt={10} borderWidth={1} borderRadius={8} boxShadow="lg">
                <Center>
                    <Heading mb={6}>Login</Heading>
                </Center>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                        <FormControl isInvalid={!!emailError}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FormErrorMessage>{emailError}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!passwordError}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <InputGroup>
                                <Input
                                    id="password"
                                    type={show ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{passwordError}</FormErrorMessage>
                        </FormControl>
                        <Button type="submit" colorScheme="blue" width="full" mt={4}>
                            Login
                        </Button>
                    </VStack>
                </form>
                <HStack>
                    <Text mt={4} textAlign="center">
                        Don't have an account?{' '}
                    </Text>
                    <Link to="/register">
                        <Text mt={4} color='blue.500'>
                            Register here
                        </Text>
                    </Link>
                </HStack>

                <HStack style={{justifyContent:'center'}}>
                    <Link to="/forgot-password" >
                        <Text mt={3} color='blue.500'>
                            Forgot Password?
                        </Text>
                    </Link>
                </HStack>
            </Box>
        </Container>
    )
}

export default Login