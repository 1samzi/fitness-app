import React from 'react'
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
    Link,
    useToast,
    Stack,
  } from '@chakra-ui/react'

import NavBar from '../NavBar'


const NutritionForm = () => {
  return( 
    <Box>
   
      <NavBar></NavBar>
        <Box w="75%" p={8} mt={10} borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto">
            <Center>
                <Heading mb={6}>Track Your Meals</Heading>
            </Center>
            <Stack>
                <Box>
                    <Heading size = 'sm'>Breakfast</Heading>
                </Box>
                <Box  mt={8}>
                    <Heading size = 'sm'>Lunch</Heading>
                </Box>
                <Box  mt={8}>
                    <Heading size = 'sm'>Dinner</Heading>
                </Box>
                <Box  mt={8}>
                    <Heading size = 'sm'>Snacks</Heading>
                </Box>
            </Stack>
            <FormControl mt={8}>
                <InputGroup>
                    <Input placeholder="Search for food...">
                        
                    </Input>
                </InputGroup>
            </FormControl>
            
        </Box>
   
    </Box>
    
)
}

export default NutritionForm