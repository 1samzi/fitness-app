'use client'

import React, { useState, useEffect } from 'react'
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
    useToast,
    HStack
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const [show, setShow] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: '',
        dateOfBirth: '',
        height: '',
        heightUnit: 'cm',
        weight: '',
        weightUnit: 'Kg',
        goal: '',
        email: '',
        password: '',
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
            case 'dateOfBirth':
                return value ? '' : 'Date of birth is required.'
            case 'goal':
                return value ? '' : 'Please select a fitness goal.'
            default:
                return ''
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'height' || name === 'weight') {
            const numValue = parseFloat(value);
            const sanitizedValue = isNaN(numValue) ? '' : Math.max(0, numValue).toString();
            setFormData((prevData) => ({
                ...prevData,
                [name]: sanitizedValue,
            }));
        } else if (name !== 'confirmPassword') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }

        const error = validateField(name, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    useEffect(() => {
        if (formData.dateOfBirth) {
            const age = calculateAge(formData.dateOfBirth);
            setFormData(prevData => ({
                ...prevData,
                age: age.toString()
            }));
        }
    }, [formData.dateOfBirth]);

    const handleUnitChange = (field, newUnit) => {
        setFormData((prevData) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key])
            if (error) {
                newErrors[key] = error
            }
        })

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:3001/api/user/create-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })

                if (response.ok) {
                    toast({
                        title: "Registration successful",
                        description: "Your account has been created.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })

                    navigate('/login')
                } else {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Registration failed')
                }
            } catch (error) {
                console.error('Registration error:', error)
                toast({
                    title: "Registration failed",
                    description: error.message || "An error occurred during registration.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
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
                            <FormControl isRequired isInvalid={errors.dateOfBirth}>
                                <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    max={new Date().toLocaleDateString('en-CA')}
                                />
                                <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="age">Age</FormLabel>
                                <Input
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    readOnly
                                    placeholder="Calculated from DOB"
                                />
                            </FormControl>
                        </SimpleGrid>
                        <SimpleGrid columns={[1, null, 2]} spacing={6}>
                            <FormControl>
                                <FormLabel htmlFor="height">Height</FormLabel>
                                <InputGroup>
                                    <Input
                                        id="height"
                                        name="height"
                                        placeholder='Enter height'
                                        value={formData.height}
                                        onChange={handleChange}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Select
                                            value={formData.heightUnit}
                                            onChange={(e) => handleUnitChange('height', e.target.value)}
                                            size="sm"
                                        >
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                        </Select>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
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
                                        min="0"
                                        step="0.01"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Select
                                            value={formData.weightUnit}
                                            onChange={(e) => handleUnitChange('weight', e.target.value)}
                                            size="sm"
                                        >
                                            <option value="kg">kg</option>
                                            <option value="lbs">lbs</option>
                                        </Select>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                        </SimpleGrid>
                        <FormControl isRequired isInvalid={errors.goal}>
                            <FormLabel htmlFor="goal">Fitness Goal</FormLabel>
                            <Select
                                id="goal"
                                name="goal"
                                placeholder='Select your goal'
                                value={formData.goal}
                                onChange={handleChange}
                            >
                                <option value='Maintain Weight'>Maintain Weight</option>
                                <option value='Gain Weight'>Gain Weight</option>
                                <option value='Lose Weight'>Lose Weight</option>
                            </Select>
                            <FormErrorMessage>{errors.goal}</FormErrorMessage>
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
                        <HStack>
                            <Text>
                                Already have an account?
                            </Text>
                            <Link to="/login">
                                <Text className='about-link-text' color='blue.500' >
                                    Login
                                </Text>
                            </Link>

                        </HStack>
                    </VStack>
                </form>
            </Box>
        </Container>
    )
}

export default Register