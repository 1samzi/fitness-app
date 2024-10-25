import React, { useState } from 'react'
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

    const handleSubmit = (e) => {
        e.preventDefault()
        const isEmailValid = validateEmail(email)
        const isPasswordValid = validatePassword(password)
        if (isEmailValid && isPasswordValid) {
            // Perform login logic here
            toast({
                title: "Login Attempt",
                description: "Attempting to log in...",
                status: "info",
                duration: 2000,
                isClosable: true,
            })
        }
        navigate('/home')
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
                <Text mt={4} textAlign="center">
                    Don't have an account?{' '}
                    <Link to="/register" color="blue.500">Register here</Link>
                </Text>
            </Box>
        </Container>
    )
}

export default Login