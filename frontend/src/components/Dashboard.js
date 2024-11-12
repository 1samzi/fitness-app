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
    Text,
    Flex,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';

 // TODO: need to be dynamic data from chart
const getData = () => {
    return [
        { asset: "Carbohydrates", amount: 55 },
        { asset: "Protein", amount: 20 },
        { asset: "Fats", amount: 30 }
    ];
}

function Dashboard() {
    // Dummy profile data
    const dummyProfile = {
        firstName: "John",
        lastName: "Doe",
        sex: "Male",
        age: 28,
        height: 175, // cm
        weight: 70,  // kg
        fitnessGoal: "Build muscle",
    };

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                // Simulate a failing API call
                throw new Error("Backend not available");

                /* Uncomment when ready to pull data from backend
                 const response = await fetch('/api/user/profile');
                 const data = await response.json();
                 setProfile(data); */
            } catch (error) {
                console.error("Error fetching profile:", error);
                setProfile(dummyProfile);  // Use dummy data for now
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    // TODO: need to be dynamic data
    const [exerciseLogs, setExerciseLogs] = useState([
        { activity: 'Cardio', minutes: 30, calories: 300 },
        { activity: 'Strength Training', minutes: 45, calories: 400 },
        { activity: 'Stretching', minutes: 60, calories: 200 },
    ]);

    // TODO: need to be dynamic data
    const [macroNutrients, setMacroNutrients] = useState([
        { name: 'Carbohydrates', total: 130, percentage: 55, goal: 50 },
        { name: 'Protein', total: 50, percentage: 20, goal: 25 },
        { name: 'Fats', total: 50, percentage: 30, goal: 25 },
    ]);

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
            <Container maxW="container.xl" py={5}>
                <VStack spacing={6}>

                    {/* Profile Section */}
                    <Box bg="white" p={6} borderRadius="md" boxShadow="md" w="full">
                        <Heading as="h2" size="lg" mb={4}>
                            Profile
                        </Heading>
                        {loading ? (
                            <Text>Loading profile...</Text>
                        ) : (
                            profile && (
                                <VStack align="start" spacing={2}>
                                    <Text><strong>First Name:</strong> {profile.firstName}</Text>
                                    <Text><strong>Last Name:</strong> {profile.lastName}</Text>
                                    <Text><strong>Sex:</strong> {profile.sex}</Text>
                                    <Text><strong>Age:</strong> {profile.age}</Text>
                                    <Text><strong>Height:</strong> {profile.height} cm</Text>
                                    <Text><strong>Weight:</strong> {profile.weight} kg</Text>
                                    <Text><strong>Fitness Goal:</strong> {profile.fitnessGoal}</Text>
                                </VStack>
                            )
                        )}
                    </Box>

                    {/* Exercise Log Section */}
                    <Box bg="white" p={6} borderRadius="md" boxShadow="md" w="full">
                        <Heading as="h2" size="lg" mb={4}>
                            Exercise Log
                        </Heading>
                        <Box width="100%" maxWidth="auto" margin="0 auto">
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

                    {/* Macro-nutrients Section */}
                    <Box bg="white" p={6} borderRadius="md" boxShadow="md" w="full">
                        <Heading as="h2" size="lg" mb={4}>
                            Macro-nutrients
                        </Heading>
                        <Box width="100%" maxWidth="auto" margin="0 auto">
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
