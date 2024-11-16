import React, { useState } from 'react';
import { Box, 
        FormControl, 
        FormLabel, 
        Input, 
        Select, 
        Button, 
        Text, 
        HStack, 
        VStack 
       } from '@chakra-ui/react';
import NavBar from '../NavBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Exercise() { 
  const [formData, setFormData] = useState({ 
    exercise: '',
    duration: '',
    intensity: '',
    weight:'',
    unit: 'lbs' //Default is pounds
  });
  const [selectedDate, setSelectedDate] = useState(new Date());  
  const [message, setMessage] = useState('');
  
  const handleChange = (event) => {              
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    const { exercise, duration, intensity, weight, unit } = formData;
    let calories = 0;

    if (exercise && duration && intensity && weight) {    
      const durationTime = parseFloat(duration);
      let weightPounds = parseFloat(weight);
    
        if (unit === 'kg') {
            weightPounds = weightPounds * 2.20462;
        }

      switch (exercise) {
        case 'Cardio':
          switch (intensity) {
            case 'High':
              calories = durationTime * (weightPounds/320) * 15;
              break;
            case 'Moderate':
              calories = durationTime * (weightPounds/320) *  10;
              break;
            case 'Low':
              calories = durationTime * (weightPounds/320) * 5;
              break;
            default:
              break;
          }
          break;

        case 'Strength':
          switch (intensity) {
            case 'High':
              calories = durationTime * (weightPounds/320) * 12;
              break;
            case 'Moderate':
              calories = durationTime * (weightPounds/320) * 8;
              break;
            case 'Low':
              calories = durationTime * (weightPounds/320) * 4;
              break;
            default:
              break;
          }
          break;

        case 'Stretching':
          switch (intensity) {
            case 'High':
              calories = durationTime * (weightPounds/320) * 6;
              break;
            case 'Moderate':
              calories = durationTime * (weightPounds/320) * 4;
              break;
            case 'Low':
              calories = durationTime * (weightPounds/320) * 2;
              break;
            default:
              break;
          }
          break;

        default:
          break;
      }

    
     
    }
     const todaysDate = selectedDate.toLocaleDateString();
      setMessage(`On ${todaysDate}, You Burned: ${calories} Calories!`);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <Box>     
      <NavBar />
      <Text fontSize="24px" mb={4}>Log Your Exercise</Text> 
      {message && <Text color="green" mb={4}>{message}</Text>}

      <HStack spacing={8} align="start">
        <VStack as="form" onSubmit={submit} spacing={4} width="50%">
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
              onChange={handleChange}
              required 
              min="0" />
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
         <FormControl mb={3}>
            <FormLabel>Weight</FormLabel>
            <HStack>
            <Input
              name="weight"
              type="number"
              placeholder="Enter Weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="0" 
            />
            <Select 
              name="unit"
              value={formData.unit}
              onChange={handleChange}>
              <option value="lbs">lbs</option>
              <option value ="kg">kg</option>
             </Select>
             </HStack>
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

