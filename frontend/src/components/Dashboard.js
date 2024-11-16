import React, { useState, useEffect } from 'react';
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
    Grid,
    GridItem,
    useColorModeValue,
} from '@chakra-ui/react';
import { AgCharts } from 'ag-charts-react';
import { jwtDecode } from 'jwt-decode';
import NavBar from './NavBar'; // Assuming you have a NavBar component

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
            fontSize: 18,
            color: '#163343',
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
                fills: ['#163343', '#3eb599', '#1e4e6f'],
                strokeWidth: 0,
            },
        ],
        legend: {
            position: 'bottom',
        },
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

    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('#163343', 'white');
    const borderColor = useColorModeValue('#3eb599', 'gray.600');

    return (
        <Box bg="#f0f4f8" minHeight="100vh">
            {/* <NavBar /> */}
            <Container maxW="container.xl" py={8}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={8}>
                    <GridItem>
                        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderColor={borderColor}>
                            <Heading as="h2" size="lg" mb={4} color="#163343">
                                Profile
                            </Heading>
                            {loading ? (
                                <Text>Loading profile...</Text>
                            ) : (
                                profile && (
                                    <VStack align="start" spacing={3}>
                                        <Text><strong>Name:</strong> {profile.firstName} {profile.lastName}</Text>
                                        <Text><strong>Sex:</strong> {profile.sex}</Text>
                                        <Text><strong>Age:</strong> {profile.age}</Text>
                                        <Text><strong>Height:</strong> {profile.height} cm</Text>
                                        <Text><strong>Weight:</strong> {profile.weight} kg</Text>
                                        <Text><strong>Goal:</strong> {profile.fitnessGoal}</Text>
                                    </VStack>
                                )
                            )}
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderColor={borderColor} mb={8}>
                            <Heading as="h2" size="lg" mb={4} color="#163343">
                                Exercise Log
                            </Heading>
                            <Table variant="simple" colorScheme="teal">
                                <Thead>
                                    <Tr>
                                        <Th color="#163343">Activity</Th>
                                        <Th color="#163343">Minutes</Th>
                                        <Th color="#163343">Calories</Th>
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
                        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderLeft="4px solid" borderColor={borderColor}>
                            <Heading as="h2" size="lg" mb={4} color="#163343">
                                Macro-nutrients
                            </Heading>
                            <Flex direction={{ base: "column", md: "row" }} justify="space-between">
                                <Box width={{ base: "100%", md: "50%" }} mb={{ base: 4, md: 0 }}>
                                    <AgCharts options={chartOptions} />
                                </Box>
                                <Box width={{ base: "100%", md: "45%" }}>
                                    <Table variant="simple" colorScheme="teal">
                                        <Thead>
                                            <Tr>
                                                <Th color="#163343">Macronutrient</Th>
                                                <Th color="#163343">Total (grams)</Th>
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
                            </Flex>
                        </Box>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
}

export default Dashboard;