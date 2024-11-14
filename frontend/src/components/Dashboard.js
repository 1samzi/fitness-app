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
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';

function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [macroNutrients, setMacroNutrients] = useState([]);
    const [chartOptions, setChartOptions] = useState({
        data: [],
        title: {
            text: "Macronutrient Distribution",
        },
        series: [
            {
                type: "pie",
                angleKey: "percentage",
                calloutLabelKey: "name",
                sectorLabelKey: "percentage",
                sectorLabel: {
                    color: "white",
                    fontWeight: "bold"
                },
            },
        ],
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const today = new Date().toISOString().split('T')[0];

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/user/profile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (response.ok) {
                    setProfile(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setProfile({
                    firstName: "John",
                    lastName: "Doe",
                    sex: "Male",
                    age: 28,
                    height: 175,
                    weight: 70,
                    fitnessGoal: "Build muscle",
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchExerciseLogs = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/user/get-exercise-logs/${userId}?date=${today}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (response.ok) {
                    setExerciseLogs(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error fetching exercise logs:", error.message);
                setExerciseLogs([
                    { activity: 'Cardio', minutes: 30, calories: 300 },
                    { activity: 'Strength Training', minutes: 45, calories: 400 },
                    { activity: 'Stretching', minutes: 60, calories: 200 },
                ]);
            }
        };

        const fetchMacroNutrients = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/user/get-macro-nutrients/${userId}?date=${today}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (response.ok) {
                    setMacroNutrients(result.data);
                    setChartOptions((prevOptions) => ({
                        ...prevOptions,
                        data: result.data,
                    }));
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error fetching macronutrients:", error.message);
                const dummyData = [
                    { name: 'Carbohydrates', total: 130, percentage: 55, goal: 50 },
                    { name: 'Protein', total: 50, percentage: 20, goal: 25 },
                    { name: 'Fats', total: 50, percentage: 30, goal: 25 },
                ];
                setMacroNutrients(dummyData);
                setChartOptions((prevOptions) => ({
                    ...prevOptions,
                    data: dummyData,
                }));
            }
        };

        fetchProfile();
        fetchExerciseLogs();
        fetchMacroNutrients();
    }, []);

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
                            <AgCharts options={chartOptions} />
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
