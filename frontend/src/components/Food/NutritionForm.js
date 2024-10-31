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

  // state on each render to help debug
  console.log("Selected Item:", selectedItem);
  console.log("Is Drawer Open:", isOpen);

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
            <Stack>
                <Box>
                    <Heading size = 'sm'>Breakfast</Heading>
                </Box>
                <Box  mt={8}>
                    <Heading size = 'sm'>Lunch</Heading>
                </Box>
                <Box  mt={8}>
                    <Heading size = 'sm'>Dinner</Heading>
                </Box>
                <Box  mt={8}>
                    <Heading size = 'sm'>Snacks</Heading>
                </Box>
            </Stack>
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
                    <Text>Per: 1 {item.measures[3].label} ({Math.ceil(item.measures[3].weight)} g)</Text>
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
          <DrawerHeader>Add Food</DrawerHeader>
          <DrawerBody>
            {selectedItem && (
              <>
                <Text fontWeight="bold">{selectedItem.food.label}</Text>
                <Text>Category: {selectedItem.food.category}</Text>
                <Text>Calories: {Math.ceil(selectedItem.food.nutrients.ENERC_KCAL)} kcal</Text>
              </>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme="blue" onClick={handleCloseDrawer}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default NutritionForm