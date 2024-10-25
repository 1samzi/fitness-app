import React, { useState } from 'react'
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    Input,
    Select,
    InputGroup,
    Button,
    InputRightElement,
    FormControl,
    FormLabel,
    FormErrorMessage,
    useToast
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

function Register() {
    const [show, setShow] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: '',
        age: '',
        height: '',
        weight: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})
    const toast = useToast()

    const handleClick = () => setShow(!show)
    const handleClickConfirm = () => setShowConfirm(!showConfirm)

    const validateField = (name, value) => {
        const nameRegex = /^[a-zA-Z]{2,30}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        switch (name) {
            case 'firstName':
            case 'lastName':
                return nameRegex.test(value) ? '' : 'Must be 2-30 characters long and contain only letters.'
            case 'email':
                return emailRegex.test(value) ? '' : 'Please enter a valid email address.'
            case 'password':
                return passwordRegex.test(value)
                    ? ''
                    : 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            case 'confirmPassword':
                return value === formData.password ? '' : 'Passwords do not match.'
            default:
                return ''
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        const error = validateField(name, value)
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = {}
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key])
            if (error) {
                newErrors[key] = error
            }
        })

        if (Object.keys(newErrors).length === 0) {
            // Form is valid, you can submit the data here
            console.log('Form submitted:', formData)
            toast({
                title: "Registration successful",
                description: "Your account has been created.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } else {
            setErrors(newErrors)
            toast({
                title: "Registration failed",
                description: "Please correct the errors in the form.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <Container maxW="container.md" py={10}>
            <Box bg="white" p={8} rounded="xl" shadow="lg">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        <Heading as="h1" size="xl" textAlign="center" color="blue.600">
                            Create Your Account
                        </Heading>
                        <Text textAlign="center" color="gray.600">
                            Join our fitness community and start your journey today!
                        </Text>
                        <SimpleGrid columns={[1, null, 2]} spacing={6}>
                            <FormControl isInvalid={errors.firstName}>
                                <FormLabel htmlFor="firstName">First Name</FormLabel>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    placeholder='Enter your first name'
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.lastName}>
                                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    placeholder='Enter your last name'
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>
                        <SimpleGrid columns={[1, null, 3]} spacing={6}>
                            <FormControl>
                                <FormLabel htmlFor="sex">Sex</FormLabel>
                                <Select
                                    id="sex"
                                    name="sex"
                                    placeholder='Select option'
                                    value={formData.sex}
                                    onChange={handleChange}
                                >
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                    <option value='other'>Other</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="age">Age</FormLabel>
                                <Input
                                    id="age"
                                    name="age"
                                    placeholder='Enter your age'
                                    value={formData.age}
                                    onChange={handleChange}
                                    type="number"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="height">Height</FormLabel>
                                <InputGroup>
                                    <Input
                                        id="height"
                                        name="height"
                                        placeholder='Enter height'
                                        value={formData.height}
                                        onChange={handleChange}
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Select defaultValue="cm" size="sm">
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                        </Select>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                        </SimpleGrid>
                        <SimpleGrid columns={[1, null, 2]} spacing={6}>
                            <FormControl>
                                <FormLabel htmlFor="weight">Weight</FormLabel>
                                <InputGroup>
                                    <Input
                                        id="weight"
                                        name="weight"
                                        placeholder='Enter weight'
                                        value={formData.weight}
                                        onChange={handleChange}
                                        type="number"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Select defaultValue="kg" size="sm">
                                            <option value="kg">kg</option>
                                            <option value="lbs">lbs</option>
                                        </Select>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl isInvalid={errors.email}>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder='Enter your Email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>
                        <FormControl isInvalid={errors.password}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <InputGroup>
                                <Input
                                    id="password"
                                    name="password"
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.confirmPassword}>
                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                            <InputGroup>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder='Confirm password'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
                                        {showConfirm ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                        <Button type="submit" colorScheme="blue" size="lg">
                            Register
                        </Button>
                        <Text>
                            Already have an account? 
                            <Link to="/login">
                                <span className='about-link-text'>
                                     Login
                                </span>
                            </Link>
                        </Text>
                    </VStack>
                </form>
            </Box>
        </Container>
    )
}

export default Register