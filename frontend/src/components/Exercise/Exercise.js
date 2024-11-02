import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Select, Button, Text } from '@chakra-ui/react';
import NavBar from '../NavBar';

function Exercise() { 
  const [formData, setFormData] = useState({ //Variable for the forms
    exercise: '',
    duration: '',
    intensity: '',
    calories: ''
  });
  const [message, setMessage] = useState('');//Variable for confirmation message
  
  const Change = (event) => {               //For changing the variables 
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const Submit = (event) => {
    event.preventDefault();
    console.log(formData);

    setMessage('Success! Exercise Logged!');
    setTimeout(() => setMessage(''), 5000);
  }

  return (
    <Box p={4} maxW="500px" mx="auto">     
      <NavBar /> 
      <Text fontSize="2xl" mb={4}>Log Your Exercise</Text> 
      {message && <Text color="green.500" mb={4}>{message}</Text>}
      <form onSubmit={Submit}>  
        <FormControl mb={3}>
          <FormLabel>Exercise Type</FormLabel>
          <Select
            name="exercise"
            placeholder="Choose type"
            value={formData.exercise}
            onChange={Change}
          >
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Weightlifting">Weightlifting</option>
          </Select>
        </FormControl>
        
        <FormControl mb={3}>
          <FormLabel>Duration (minutes)</FormLabel>
          <Input
            name="duration"
            type="number"
            placeholder="Enter duration"
            value={formData.duration}
            onChange={Change}
          />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Intensity</FormLabel>
          <Select
            name="intensity"
            placeholder="Choose intensity"
            value={formData.intensity}
            onChange={Change}
          >
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </Select>
        </FormControl>
        
        <FormControl mb={3}>
          <FormLabel>Calories Burned</FormLabel>
          <Input
            name="calories"
            type="number"
            placeholder="Enter calories burned"
            value={formData.calories}
            onChange={Change}
          />
        </FormControl>
        <Button colorScheme="blue" type="submit" mt={4}>Submit</Button>
      </form>
    </Box>
  );
}

export default Exercise;
