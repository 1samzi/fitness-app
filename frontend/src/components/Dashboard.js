import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Container,
    VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react';
import { AgCharts } from 'ag-charts-react';

    // TODO: need to be dynamic data fro chart
const getData = () => {
    return [
        { asset: "Carbohydrates", amount: 55 },
        { asset: "Protein", amount: 20 },
        { asset: "Fats", amount: 30 }
    ];
}

function Dashboard() {

    // TODO: need to be dynamic data
    const [exerciseLogs, setExerciseLogs] = useState([
        { activity: 'Cardio', minutes: 30, calories: 300 },
        { activity: 'Strength Training', minutes: 45, calories: 400 },
        { activity: 'Stretching', minutes: 60, calories: 200 },
    ])

    // TODO: need to be dynamic data
    const [macroNutrients, setMacroNutrients] = useState([
        { name: 'Carbohydrates', total: 130, percentage: 55, goal: 50 },
        { name: 'Protein', total: 50, percentage: 20, goal: 25 },
        { name: 'Fats', total: 50, percentage: 30, goal: 25 },
    ])

    const [options, setOptions] = useState({
        data: getData(),
        title: {
            text: "Portfolio Composition",
        },
        series: [
            {
                type: "pie",
                angleKey: "amount",
                calloutLabelKey: "asset",
                sectorLabelKey: "amount",
                sectorLabel: {
                    color: "white",
                    fontWeight: "bold"
                },
            },
        ],
    });



    return (
        <Box>
            DashBoard (Note: Write your dashboard components under this page)

            <Container maxW="container.xl" py={5}>
                <VStack spacing={6}>
                    <Box bg="white" p={6} borderRadius="md" boxShadow="md" w="full">
                        <Heading as="h2" size="lg" mb={4}>
                            Exercise Log
                        </Heading>
                        <Box width="100%" maxWidth="auto" margin="0 auto">
                            {/* Placeholder for chart */}
                            <AgCharts options={options} />
                        </Box>
                        <Table variant="striped" colorScheme="teal">
                            <Thead>
                                <Tr>
                                    <Th>Activity</Th>
                                    <Th>Minutes</Th>
                                    <Th>Calories</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {exerciseLogs.map((log, index) => (
                                    <Tr key={index}>
                                        <Td>{log.activity}</Td>
                                        <Td>{log.minutes}</Td>
                                        <Td>{log.calories}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>

                    <Box bg="white" p={6} borderRadius="md" boxShadow="md" w="full">
                        <Heading as="h2" size="lg" mb={4}>
                            Macro-nutrients
                        </Heading>
                        <Box width="100%" maxWidth="auto" margin="0 auto">
                            {/* Placeholder for chart */}
                            <AgCharts options={options} />
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
                                {macroNutrients.map((nutrient, index) => (
                                    <Tr key={index}>
                                        <Td>{nutrient.name}</Td>
                                        <Td>{nutrient.total}g</Td>
                                        <Td>{nutrient.percentage}%</Td>
                                        <Td>{nutrient.goal}%</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Container>

        </Box>
    );
}

export default Dashboard;