import React, { useState } from 'react';
import { Box, 
        FormControl, 
        FormLabel, 
        Input, 
        Select, 
        Button, 
        Text, 
        HStack, 
        VStack } from '@chakra-ui/react';
import NavBar from '../NavBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jwtDecode } from 'jwt-decode';

function Exercise() { 
  const [formData, setFormData] = useState({ exercise: '', duration: '', intensity: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());  
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = jwtDecode(token)._id;

  const handleChange = (event) => {              
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const calculateCalories = () => {
    const { exercise, duration, intensity } = formData;
    let calories = 0;
    const durationTime = parseFloat(duration);

    if (exercise && duration && intensity) {
      switch (exercise) {
        case 'Cardio':
          calories = durationTime * (intensity === 'High' ? 15 : intensity === 'Moderate' ? 10 : 5);
          break;
        case 'Strength':
          calories = durationTime * (intensity === 'High' ? 12 : intensity === 'Moderate' ? 8 : 4);
          break;
        case 'Stretching':
          calories = durationTime * (intensity === 'High' ? 6 : intensity === 'Moderate' ? 4 : 2);
          break;
        default:
          break;
      }
    }
    return calories;
  };

  // Send exercise log to backend
  const submitExerciseLog = async (event) => {
    event.preventDefault();

    const calories = calculateCalories();
    const date = selectedDate.toISOString().split('T')[0];
    const exerciseData = { ...formData, calories, date };

    try {
      const response = await fetch(`http://localhost:3001/api/user/log-exercise/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(exerciseData),
      });

      if (response.ok) {
        setMessage(`On ${date}, You Burned: ${calories} Calories!`);
      } else {
        throw new Error('Failed to log exercise');
      }
    } catch (error) {
      console.error('Error logging exercise:', error);
      setMessage('Failed to log exercise.');
    }

    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <Box>     
      <NavBar />
      <Text fontSize="24px" mb={4}>Log Your Exercise</Text> 
      {message && <Text color="green" mb={4}>{message}</Text>}

      <HStack spacing={8} align="start">
        <VStack as="form" onSubmit={submitExerciseLog} spacing={4} width="50%">
          <FormControl mb={3}>
            <FormLabel>Exercise Type</FormLabel>
            <Select
              name="exercise"
              placeholder="Choose type"
              value={formData.exercise}
              onChange={handleChange}>
              <option value="Cardio">Cardio</option>
              <option value="Strength">Strength Training</option>
              <option value="Stretching">Stretching</option>
            </Select>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Duration (minutes)</FormLabel>
            <Input
              name="duration"
              type="number"
              placeholder="Enter duration"
              value={formData.duration}
              onChange={handleChange}/>
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Intensity</FormLabel>
            <Select
              name="intensity"
              placeholder="Choose intensity"
              value={formData.intensity}
              onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </Select>
          </FormControl>
          <Button colorScheme="blue" type="submit" mt={4}>Submit</Button>
        </VStack>

        <Box>
          <Text fontSize="20px" mb={2}>Select Date</Text>
          <DatePicker 
            selected={selectedDate} 
            onChange={(date) => setSelectedDate(date)} 
            dateFormat="MMMM d, yyyy"
            inline/>
        </Box>
      </HStack>
    </Box>
  );
}

export default Exercise;
