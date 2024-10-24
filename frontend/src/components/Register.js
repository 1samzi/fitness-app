import React from 'react'
import { Box, Center, Heading, Text, VStack, HStack, Input, Select, InputGroup,Button, InputRightElement } from '@chakra-ui/react';


function Register() {

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <Box margin={10} rounded={15} p={5} shadow='md' borderWidth='2px'>
            <VStack>
                <Center >
                    <Heading fontSize='4xl' >Register</Heading>
                </Center>
                <Center>
                    <VStack>
                        <HStack>
                            <VStack arginRight={'100pt'}>
                                <Heading fontSize='large' m>First Name</Heading>
                                <Input placeholder='Enter you first name' />
                            </VStack>

                            <VStack>
                                <Heading fontSize='large'>Last Name</Heading>
                                <Input placeholder='Enter your last name' />
                            </VStack>
                        </HStack>
                        <HStack>
                            <VStack>
                                <Heading fontSize='large'>Sex</Heading>
                                <Select placeholder='Select option'>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                </Select>
                            </VStack>
                            <VStack>
                                <Heading fontSize='large'>Age</Heading>
                                <Input placeholder='Enter your age' />
                            </VStack>
                        </HStack>
                        <HStack>
                            <VStack>
                                <Heading fontSize='large'>Height</Heading>
                                <Input placeholder='Enter your age' />
                            </VStack>
                            <VStack>
                                <Heading fontSize='large'>Weight</Heading>
                                <Input placeholder='Enter your age' />
                            </VStack>
                        </HStack>
                        <VStack>
                            <Heading fontSize='large'>Email</Heading>
                            <Input placeholder='Enter your Email' />
                        </VStack>
                        <VStack>
                            <Heading fontSize='large'>Password</Heading>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </VStack>
                        <VStack>
                            <Heading fontSize='large'>ConfirmPassword</Heading>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </VStack>
                        <Button variant='solid'>Register</Button>
                    </VStack>
                </Center>
            </VStack>

        </Box>
    )
}

export default Register
