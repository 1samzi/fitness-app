import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Select, Button, Text } from '@chakra-ui/react';
import NavBar from '../NavBar';

function Exercise() { 
    
    // State variables for form fields
    
  const [exerciseType, setExerciseType] = useState(''); 
  const [duration, setDuration] = useState('');        
  const [intensity, setIntensity] = useState('');       
  const [caloriesBurned, setCaloriesBurned] = useState(''); 

  // Event handlers for form fields to update state
    
  const handleTypeChange = (event) => setExerciseType(event.target.value);
  const handleDurationChange = (event) => setDuration(event.target.value);
  const handleIntensityChange = (event) => setIntensity(event.target.value);
  const handleCaloriesChange = (event) => setCaloriesBurned(event.target.value);

  // Form submission handler.
    
  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log({
      exerciseType,
      duration,
      intensity,
      caloriesBurned
    }); 
  };

  return (
    <Box p={4} maxW="500px" mx="auto"> 
      <NavBar /> 
      <Text fontSize="2xl" mb={4}>Log Your Exercise</Text> 

     {/*Exercise Form*/}
      
      <form onSubmit={handleSubmit}>  
        <FormControl mb={3}>
          <FormLabel>Exercise Type</FormLabel>
          <Select placeholder="Select type" value={exerciseType} onChange={handleTypeChange}>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Weightlifting">Weightlifting</option>
          </Select>
        </FormControl>
      

        {/*Duration Input */}
      
        <FormControl mb={3}>
          <FormLabel>Duration (minutes)</FormLabel>
          <Input
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={handleDurationChange}
          />
        </FormControl>
    

         
         {/*Intensity Dropdown*/}
    
        <FormControl mb={3}>
          <FormLabel>Intensity</FormLabel>
          <Select placeholder="Select intensity" value={intensity} onChange={handleIntensityChange}>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </Select>
        </FormControl>
    

       
         {/*Calories Burned Input*/}
    
        <FormControl mb={3}>
          <FormLabel>Calories Burned</FormLabel>
          <Input
            type="number"
            placeholder="Enter calories burned"
            value={caloriesBurned}
            onChange={handleCaloriesChange}
          />
        </FormControl>
    

    
        {/*Submit Button */}
    
        <Button colorScheme="blue" type="submit" mt={4}>Submit</Button>
      </form>
    </Box>
  );
}

export default Exercise;
