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
import { jwtDecode } from 'jwt-decode';


function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [macroNutrients, setMacroNutrients] = useState([]);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken._id;
    const today = new Date().toISOString().split('T')[0];

    const [chartOptions, setChartOptions] = useState({
        data: [],
        title: {
            text: "Macronutrient Distribution",
        },
        series: [
            {
                type: "pie",
                angleKey: "value",
                calloutLabelKey: "name",
                sectorLabelKey: "value",
                sectorLabel: {
                    color: "white",
                    fontWeight: "bold"
                },
            },
        ],
    });

    useEffect(() => {
        fetchProfile();
        fetchMacroNutrients();
        fetchExerciseLogs();
    }, []);

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
            const response = await fetch(`http://localhost:3001/api/user/get-macros/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (response.ok) {
                const macrosData = [
                    { name: 'Protein', value: result.data.protein },
                    { name: 'Fat', value: result.data.fat },
                    { name: 'Carbohydrates', value: result.data.carbohydrates },
                ];
                setMacroNutrients(macrosData);
                setChartOptions((prevOptions) => ({
                    ...prevOptions,
                    data: macrosData,
                }));
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Error fetching macronutrients:", error.message);
            const dummyData = [
                { name: 'Carbohydrates', value: 130 },
                { name: 'Protein', value: 50 },
                { name: 'Fat', value: 50 },
            ];
            setMacroNutrients(dummyData);
            setChartOptions((prevOptions) => ({
                ...prevOptions,
                data: dummyData,
            }));
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/user/getUserById/${userId}`, {
                headers: {
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
                                </Tr>
                            </Thead>
                            <Tbody>
                                {macroNutrients.map((nutrient, index) => (
                                    <Tr key={index}>
                                        <Td>{nutrient.name}</Td>
                                        <Td>{nutrient.value}g</Td>
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