import React, { useEffect } from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react';
import { Chart, Pie } from 'chart.js';

function Dashboard() {
    useEffect(() => {
        const ctx = document.getElementById('macronutrientChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Protein', 'Carbohydrates', 'Fats'],
                datasets: [{
                    data: [150, 250, 70], // Values in grams
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 99, 132, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Macronutrient Breakdown' }
                }
            }
        });
    }, []);

    return (
        <Box p={4} bg="#f4f4f4" minHeight="100vh">
            <Heading as="h1" textAlign="center" mb={6}>Fitness Dashboard</Heading>

            {/* Exercise Log Section */}
            <Box bg="white" p={6} borderRadius="md" boxShadow="md" mb={6}>
                <Heading as="h2" size="lg" mb={4}>Exercise Log</Heading>
                <Table variant="striped" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th>Activity</Th>
                            <Th>Minutes</Th>
                            <Th>Calories</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Cardio</Td>
                            <Td>30</Td>
                            <Td>300</Td>
                        </Tr>
                        <Tr>
                            <Td>Strength Training</Td>
                            <Td>45</Td>
                            <Td>400</Td>
                        </Tr>
                        <Tr>
                            <Td>Stretching</Td>
                            <Td>60</Td>
                            <Td>200</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>

            {/* Macronutrient Chart Section */}
            <Box bg="white" p={6} borderRadius="md" boxShadow="md" mb={6}>
                <Heading as="h2" size="lg" mb={4}>Macro-nutrients</Heading>
                <Box width="100%" maxWidth="600px" margin="0 auto">
                    <canvas id="macronutrientChart"></canvas>
                </Box>
                <Table variant="striped" colorScheme="teal" mt={6}>
                    <Thead>
                        <Tr>
                            <Th>Macronutrient</Th>
                            <Th>Total (grams)</Th>
                            <Th>Percentage of Daily Caloric Intake</Th>
                            <Th>Goal</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Carbohydrates</Td>
                            <Td>130g</Td>
                            <Td>55%</Td>
                            <Td>50%</Td>
                        </Tr>
                        <Tr>
                            <Td>Protein</Td>
                            <Td>50g</Td>
                            <Td>20%</Td>
                            <Td>25%</Td>
                        </Tr>
                        <Tr>
                            <Td>Fats</Td>
                            <Td>50g</Td>
                            <Td>30%</Td>
                            <Td>25%</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
}

export default Dashboard;
