import React, {useState} from 'react'
import {
    Box,
    Button,
    Center,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Text,
    Link,
    useToast,
    Stack,
    Drawer, 
    DrawerBody, 
    DrawerFooter, 
    DrawerHeader, 
    DrawerOverlay, 
    DrawerContent, 
    useDisclosure,
    List,
    ListItem,
    HStack,
    Progress,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
  } from '@chakra-ui/react'

import NavBar from '../NavBar'

const ITEMS_PER_PAGE = 5;

const NutritionForm = () => {

  const [query, setQuery] = useState('');  // Storing the search input
  const [foodData, setFoodData] = useState([]);  // API response data
  const toast = useToast(); // Error message pop ups
  
  const [currentPage, setCurrentPage] = useState(1); // Used for food data
  
  const { isOpen, onOpen, onClose } = useDisclosure(); // handle open or close state for popup modal
  const [selectedItem, setSelectedItem] = useState(null); // Clicked food to add 
 
  // adding to sections 
  const [breakfastItems, setBreakfastItems] = useState([]);
  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [snackItems, setSnackItems] = useState([]);

  // selection of quantity when drawer is open
  const [quantity, setQuantity] = useState(1);



  //for progress bar
  const calorieGoal = 2000; // Set a calorie goal
  
  // Calculate total calories from all sections
  const calculateTotalCalories = () => {
    return [...breakfastItems, ...lunchItems, ...dinnerItems, ...snackItems].reduce(
      (total, item) => total + Math.ceil(item.food.nutrients.ENERC_KCAL),
      0
    );
  };

  const totalCalories = calculateTotalCalories();
  const progressValue = (totalCalories / calorieGoal) * 100;

  const fetchFoodData = async () => {
    console.log("Running `fetchFoodData` now.");
    
    if (query === '') {
      toast({
        title: "Please enter a food item to search.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const appId = '6fe5132c';
      const appKey = '635f181a08b732a384c456a90d2b45f5';
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=${appId}&app_key=${appKey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("API Data Hints:", data.hints);
      setFoodData(data.hints || []); 
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching food data:", error);
      toast({
        title: "Error fetching data.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    
  };
  
  // Handling page information for food requests
  const totalPages = Math.ceil(foodData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  //Slice of the array that we are on
  const currentItems = foodData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    console.log(currentItems)
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  

  //handling food selection

  const handleItemClick = (item) => {
    console.log("Function `handleItemClick` triggered");  // log to see if function is triggered
    console.log("Clicked item:", item); // item data
    
    setSelectedItem(item);
    onOpen(); // Open the modal
  };


  const handleCloseDrawer = () => {
    onClose();
    // Delay clearing the selectedItem to prevent UI freeze
    setTimeout(() => {
      setSelectedItem(null);
    }, 300); // 300ms delay, adjust if needed
  };

  //adding items to main menu 
  const addItemToSection = (section, item) => {
    const itemWithId = { ...item, id: Date.now() }; // Give each item a unique ID
    switch (section) {
      case 'Breakfast':
        setBreakfastItems([...breakfastItems, itemWithId]);
        break;
      case 'Lunch':
        setLunchItems([...lunchItems, itemWithId]);
        break;
      case 'Dinner':
        setDinnerItems([...dinnerItems, itemWithId]);
        break;
      case 'Snacks':
        setSnackItems([...snackItems, itemWithId]);
        break;
      default:
        break;
    }
    handleCloseDrawer();
  };

  //Allow for a limit of going over 20% of total cals
  const maxAllowedQuantity = selectedItem
  ? Math.floor(((totalCalories - calculateTotalCalories()) / selectedItem.food.nutrients.ENERC_KCAL) * 1.2)
  : 1;

  const removeItem = (section, id) => {
    const removeById = (items) => items.filter((item) => item.id !== id);
    switch (section) {
      case 'Breakfast':
        setBreakfastItems(removeById(breakfastItems));
        break;
      case 'Lunch':
        setLunchItems(removeById(lunchItems));
        break;
      case 'Dinner':
        setDinnerItems(removeById(dinnerItems));
        break;
      case 'Snacks':
        setSnackItems(removeById(snackItems));
        break;
      default:
        break;
    }
  };

  const calculateSectionCalories = (items) => {
    return items.reduce((total, item) => total + item.food.nutrients.ENERC_KCAL * item.quantity, 0);
  };

  const renderSectionItems = (section, items) => (
    <List spacing={2} mt={2}>
      {items.map((item) => (
        <ListItem key={item.id}>
          <HStack justify="space-between">
            <Text>{item.food.label} {Math.ceil(item.food.nutrients.ENERC_KCAL)}</Text>
            <Button size="xs" colorScheme="red" onClick={() => removeItem(section, item.id)}>
              Remove
            </Button>
          </HStack>
        </ListItem>
      ))}
    </List>
  );
  
  return( 
    <Box>
      <NavBar></NavBar>
        {
          // main menu with meals being tracked here
        }
        <Box w="75%" p={8} mt={10} borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto">
            <Center>
                <Heading mb={6}>Track Your Meals</Heading>
            </Center>
              {/* Calorie Goal Progress Bar */}
            <VStack spacing={4} mt={4}>
              <Text>Total Calories: {totalCalories} / {calorieGoal} kcal</Text>
              <Progress colorScheme="green" size="lg" value={progressValue} w="75%"/>
            </VStack>
            <Box w="75%" p={8} mt={10} borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto">
              <Heading size="md">Meals</Heading>
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((section) => (
                <Box key={section}  mt={8}>
                  <Heading size="sm">{section}</Heading>
                  {renderSectionItems(section, {
                    Breakfast: breakfastItems,
                    Lunch: lunchItems,
                    Dinner: dinnerItems,
                    Snacks: snackItems,
                  }[section])}
                </Box>
              ))}
            </Box>
            <FormControl mt={8}>
                <InputGroup>
                    <Input placeholder="Search for food..."
                    backgroundColor='gray.200'
                    mt = {8}
                    onChange = {(e) => setQuery(e.target.value)}
                    onKeyDown={(e)=>{
                      if (e.key === 'Enter'){
                        fetchFoodData();
                      }
                    }}
                    textAlign={'center'}
                    value = {query}
                    autoComplete="off">
                        
                    </Input>
                </InputGroup>
                <Button 
                w = "100%"
                onClick={fetchFoodData}
                mt ={1}
                >
                Search
                </Button>
            </FormControl>
        </Box>
        {
          // search results components
        }
        <Box w="75%" p={8} mt={10} borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto">
          <Stack direction='column'>
          <Heading size="md">Track Your Meals</Heading>
          
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
                <Box key={index} 
                p={4} 
                borderWidth={1} 
                borderRadius="md" 
                mt={2}
                as="button"
                textAlign="left"
                _hover={{ backgroundColor: "gray.200", cursor: "pointer" }}
                onClick={() => handleItemClick(item)}>
                  <Text fontWeight="bold">{item.food.label}</Text>
                  <Text>Category: {item.food.category}</Text>
                  <Text>Calories: {Math.ceil(item.food.nutrients.ENERC_KCAL) || "N/A"} kcal</Text>
                  {item.measures && item.measures.length > 0 ? (
                    <Text>Per: 1 {item.measures[0].label} ({Math.ceil(item.measures[0].weight)} g)</Text>
                  ) : (
                    <Text>Serving Size: N/A</Text>
                  )}
                </Box>
        
            ))
          ) : (
            
            <Text>No results to display.</Text>
            
          )}
          {
          // Prev/Forward components
          }
          <Box mt={8} display="flex" justifyContent="space-between" p={8} borderWidth={1} borderRadius={8}>
            <Button 
              onClick={handlePreviousPage} 
              isDisabled={currentPage === 1}
              w = "33%"
              p = {30}
            >
              Previous 
            </Button>
            <Text mt ={5}>{currentPage} of {Math.max(totalPages, 1)}</Text>
            <Button 
              onClick={handleNextPage} 
              isDisabled={currentPage === (totalPages > 0 ? totalPages : 1)}
              w = "33%"
              p = {30}
            >
              Next 
            </Button>
          </Box>
          
        </Stack>
      </Box>
      {/* Drawer for selected food item */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={handleCloseDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Select Meal</DrawerHeader>
          <DrawerBody>
            {selectedItem && (
              <VStack spacing={4} align="start">
                <Text fontWeight="bold">{selectedItem.food.label}</Text>
                <Text>Category: {selectedItem.food.category}</Text>
                <Text>
                  Calories per serving: {Math.ceil(selectedItem.food.nutrients.ENERC_KCAL)} kcal
                </Text>

                {/* Quantity slider */}
                <Box width="100%">
                  <Text>Quantity:</Text>
                  <Slider
                    min={1}
                    max={maxAllowedQuantity}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    w="10%"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>

                {/* Total calories display */}
                <Text>
                  Total Calories: {Math.ceil(selectedItem.food.nutrients.ENERC_KCAL * quantity)} kcal
                </Text>

                {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((section) => (
                  <Button
                    key={section}
                    colorScheme="blue"
                    width="100%"
                    onClick={() => addItemToSection(section, selectedItem)}
                    isDisabled={quantity === 0} // Disable if quantity is zero
                  >
                    Add to {section}
                  </Button>
                ))}
              </VStack>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="red" onClick={handleCloseDrawer}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default NutritionForm