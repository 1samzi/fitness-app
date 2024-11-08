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
    Select,
    StatHelpText,
    Stat,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

import NavBar from '../NavBar'
const appId = '6fe5132c';
const appKey = '635f181a08b732a384c456a90d2b45f5';


const ITEMS_PER_PAGE = 8;


//for progress bar
const calorieGoal = 2000; // Set a calorie goal

// handle items with 0 calories
const maxServings = 30;

const NutritionForm = () => {

  const [query, setQuery] = useState('');  // Storing the search input
  const [foodData, setFoodData] = useState([]);  // API response data
  const toast = useToast(); // Error message pop ups
  
  const [currentPage, setCurrentPage] = useState(1); // Used for food data
  
  const { isOpen, onOpen, onClose } = useDisclosure(); // handle open or close state for drawer
  const [selectedItem, setSelectedItem] = useState(null); // Clicked food to add 
 
  // adding to sections 
  const [breakfastItems, setBreakfastItems] = useState([]);
  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [snackItems, setSnackItems] = useState([]);

  // selection of quantity when drawer is open
  const [quantity, setQuantity] = useState(1);



  // Modal state for section items
  const {
    isOpen: isSectionOpen,
    onOpen: onSectionOpen,
    onClose: onSectionClose,
  } = useDisclosure();
  
  const [selectedSectionItem, setSelectedSectionItem] = useState(null);


  //handler for clicking on section items
  const handleSectionItemClick = (item) => {
      console.log("Function `handleSectionItemClick` called: " + item.food.label);
      setSelectedSectionItem(item);
      onSectionOpen();
  };

  const handleSectionClose = () =>{
    onSectionClose();
    setTimeout(() => {
      setSelectedSectionItem(null);
    }, 300); // Optional delay
  }



  // Calculate total calories from all sections
  const calculateTotalCalories = () => {
    return [...breakfastItems, ...lunchItems, ...dinnerItems, ...snackItems].reduce(
      (total, item) => total + (Math.floor(item.food.nutrients.ENERC_KCAL )* item.quantity),
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
    onOpen(); // open the drawer
  };


  const handleCloseDrawer = () => {
    onClose();
    // Delay clearing the selectedItem to prevent UI freeze
    setTimeout(() => {
      setSelectedItem(null);
    }, 300); // 300ms delay, adjust if needed
  };

  //adding items to main menu 
  const addItemToSection =  (section, item) => {

     
        const adjustedItem = {
          ...item,
          quantity,
          dateAdded: new Date().toISOString().split('T')[0], //current date (YYYY-MM-DD) for historic data
          section: section
        };
        console.log(adjustedItem);
        // Add item to the respective meal section
        const newItem = { ...adjustedItem, id: item.food.foodId }; // Use foodId as the unique ID
    
        const updateOrAddItem = (currentItems) => {
          const existingItemIndex = currentItems.findIndex(existingItem => existingItem.id === newItem.id);
          if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            const updatedItems = [...currentItems];
            updatedItems[existingItemIndex].quantity += quantity;
            return updatedItems;
          } else {
            // Add as new item if not found
            return [...currentItems, newItem];
          }
        };
    
      switch (section) {
        case 'Breakfast':
          setBreakfastItems(updateOrAddItem(breakfastItems));
          break;
        case 'Lunch':
          setLunchItems(updateOrAddItem(lunchItems));
          break;
        case 'Dinner':
          setDinnerItems(updateOrAddItem(dinnerItems));
          break;
        case 'Snacks':
          setSnackItems(updateOrAddItem(snackItems));
          break;
        default:
          break;
      }
  
      setQuantity(0);
      handleCloseDrawer();
  };

  const adjustItemInSection = (selectedSectionItem, quantity) =>{
    console.log ("adjusting an Item in this section")
    // Update the quantity if it's greater than zero
    const updatedItem = {
      ...selectedSectionItem,
      quantity: quantity,
    };

    if (quantity === 0){
      // Remove the item if the new quantity is zero or less
      removeItem(selectedSectionItem.section, selectedSectionItem.id);
    }
    else{
      const updateSectionItems = (items) =>
        items.map((item) =>
          item.id === selectedSectionItem.id ? updatedItem : item
        );
  
      switch (selectedSectionItem.section) {
        case 'Breakfast':
          setBreakfastItems(updateSectionItems(breakfastItems));
          break;
        case 'Lunch':
          setLunchItems(updateSectionItems(lunchItems));
          break;
        case 'Dinner':
          setDinnerItems(updateSectionItems(dinnerItems));
          break;
        case 'Snacks':
          setSnackItems(updateSectionItems(snackItems));
          break;
        default:
          break;
      }
    }
    handleSectionClose(); 
  };
  //Allow for a limit of going over 20% of total cals
  const maxAllowedQuantity = selectedItem
  ? Math.min(
      Math.ceil(((calorieGoal - totalCalories) / (selectedItem.food.nutrients.ENERC_KCAL || 1)) * 1.2),
      maxServings
    )
  : 1;

  const adjustQuantity = selectedSectionItem ? Math.min(
    Math.ceil(((calorieGoal - totalCalories) / (selectedSectionItem.food.nutrients.ENERC_KCAL || 1)) * 1.2),
    maxServings
    
  )
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

  const renderSectionItems = (section, items) => (
    <List spacing={2} mt={2}>
      {items.map((item) => (
        <ListItem key={item.id}>
            {/* Display label, quantity, and total calories for the item */}
            <Box
            as="button"
            padding="1"
            borderWidth="2px"
            width={'100%'}
            textAlign="left" 
            alignContent={'left'}
            borderRadius={'md'}
            pl ={'10px'}
            onClick={() => handleSectionItemClick(item)}
            >
            <Stat>{item.food.label} ({item.quantity})  
            <StatHelpText size={'sm'}>
              {Math.floor(item.food.nutrients.PROCNT) * item.quantity} p | {Math.floor(item.food.nutrients.FAT)* item.quantity} f | {Math.floor(item.food.nutrients.CHOCDF)* item.quantity} c | {(Math.floor(item.food.nutrients.ENERC_KCAL) * item.quantity)} calories
            </StatHelpText></Stat>
            
            
            {/* <Button size="xs" colorScheme="red" onClick={() => removeItem(section, item.id)}>
              Remove
            </Button> */}
            </Box>
        </ListItem>
      ))}
    </List>
  );
  
// Function to calculate total macros
const getTotalMacros = () => {
  const allItems = [...breakfastItems, ...lunchItems, ...dinnerItems, ...snackItems];
  return allItems.reduce(
    (totals, item) => ({
      calories:totals.calories + (Math.floor( item.food.nutrients.ENERC_KCAL) * item.quantity),
      protein: totals.protein + (Math.floor( item.food.nutrients.PROCNT) * item.quantity),
      fat: totals.fat + (Math.floor(item.food.nutrients.FAT ) * item.quantity),
      carbohydrates: totals.carbohydrates +  (Math.floor(item.food.nutrients.CHOCDF ) * item.quantity),
    }), {calories: 0, protein: 0, fat: 0, carbohydrates: 0}
  );
};



const totalMacros = getTotalMacros();


  return( 
    <Box>
      <NavBar></NavBar>
        {
          // main menu with meals being tracked here
        }
        <Box w="50%" p={8} mt={10} borderWidth={1} borderRadius={8} boxShadow="lg" mx="auto">
            <Center>
                <Heading mb={6}>Track Your Meals</Heading>
            </Center>
              {/* Calorie Goal Progress Bar */}
            <VStack spacing={4} mt={4}>
                <Stat> 
                  <StatHelpText> 
                  Calories Consumed {totalCalories} / {calorieGoal} Calorie Goal
                  </StatHelpText>
                </Stat> 
              <Progress colorScheme={progressValue > 100 ? "orange" : "green"} size="lg" value={progressValue} w="75%"/>
              <Stack direction={'row'}>
                <Box 
                p={4} 
                borderWidth={1} 
                borderRadius="md" 
                mt={2}
                backgroundColor={'rgba(54, 162, 235, 0.6)'}
                w = "100px"
                >
                  <Stat> 
                  <StatHelpText> 
                  Protein 
                  </StatHelpText>
                  </Stat>
                 {totalMacros.protein}</Box>
                <Box
                p={4} 
                borderWidth={1} 
                borderRadius="md" 
                mt={2}
                w = "100px"
                backgroundColor={'rgba(255, 99, 132, 0.6)'}
                >
                <Stat> 
                  <StatHelpText> 
                  Fat 
                  </StatHelpText>
                  </Stat>  
                  {totalMacros.fat}</Box>
                <Box
                p={4} 
                borderWidth={1} 
                borderRadius="md" 
                mt={2}
                w = "100px"
                backgroundColor={'rgba(255, 206, 86, 0.6)'}
                >
                <Stat> 
                  <StatHelpText> 
                  Carbs
                  </StatHelpText>
                  </Stat>
                  {totalMacros.carbohydrates}</Box>
              </Stack>
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

            {/* Section Item Modal */}
            <Modal isOpen={isSectionOpen} onClose={handleSectionClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                
                <Heading fontWeight="normal" marginBottom={3}>Edit {selectedSectionItem?.section}</Heading>
                  {selectedSectionItem?.food.label} ({quantity ? quantity: selectedSectionItem?.quantity}) {(quantity? quantity *  Math.floor(selectedSectionItem?.food.nutrients.ENERC_KCAL) : Math.floor(selectedSectionItem?.food.nutrients.ENERC_KCAL) * selectedSectionItem?.quantity)} calories</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {/* Content and actions of selected item*/}
                  
                  <Center>
                    <Stack direction={'row'}>
                    <Box p={4} 
                        borderWidth={2} 
                        borderRadius="md" 
                        mt={2}
                        backgroundColor={'rgba(54, 162, 235, 0.6)'}
                        w = "100px">
                      <Text>{quantity? quantity * Math.floor(selectedSectionItem?.food.nutrients.PROCNT) :Math.floor(selectedSectionItem?.food.nutrients.PROCNT) * selectedSectionItem?.quantity} p 
                      </Text> 
                    </Box> 
                    <Box
                        p={4} 
                        borderWidth={2} 
                        borderRadius="md" 
                        mt={2}
                        w = "100px"
                        backgroundColor={'rgba(255, 99, 132, 0.6)'}
                        >
                      <Text>
                      {quantity? quantity * Math.floor(selectedSectionItem?.food.nutrients.FAT) :Math.floor(selectedSectionItem?.food.nutrients.FAT)* selectedSectionItem?.quantity} f  
                      </Text>
                    </Box>
                    <Box
                      p={4} 
                      borderWidth={1} 
                      borderRadius="md" 
                      mt={2}
                      w = "100px"
                      backgroundColor={'rgba(255, 206, 86, 0.6)'}
                      >
                    {quantity? quantity * Math.floor(selectedSectionItem?.food.nutrients.CHOCDF) : Math.floor(selectedSectionItem?.food.nutrients.CHOCDF)* (selectedSectionItem?.quantity)} c </Box>
                    </Stack>
                  </Center>
                  <Text mt = {'5'}>Adjust Quantity: {quantity}</Text>
                    <Slider 
                        aria-label="quantity-slider"
                        defaultValue={selectedItem?.quantity}
                        min={0}
                        max={adjustQuantity} // Adjust this based on calorie goal and item data
                        onChange={(value) => setQuantity(value)}
                        value={quantity}
                        step={0.5}
                      >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline" mr={3} onClick={handleCloseDrawer}>Cancel</Button>
                  <Button colorScheme="blue" mr={3} onClick={() => adjustItemInSection(selectedSectionItem, quantity)}>Make Changes</Button>
                  <Button colorScheme="red" mr={3} onClick={() => adjustItemInSection(selectedSectionItem, 0)}>Delete Item</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

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
                  <Text fontWeight="bold">{item.food.label} {item.food.brand !== undefined ? ` (${item.food.brand})` : ``}</Text>
                  <Text>Category: {item.food.category}</Text>
                  <Text>Calories: {Math.ceil(item.food.nutrients.ENERC_KCAL) || "0"} kcal</Text>
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
          <DrawerHeader>Add Food</DrawerHeader>
          <DrawerBody alignItems={'center'}>
            {selectedItem && (
              <VStack spacing={4} align="start">
                <Text fontWeight="bold">{selectedItem.food.label}</Text>
                <Text>Category: {selectedItem.food.category}</Text>
                <Text>
                  Calories per serving: {Math.ceil(selectedItem.food.nutrients.ENERC_KCAL)} kcal
                </Text>

                

                {/* Total calories display */}
                <Text>
                  Total Calories: {Math.ceil(selectedItem.food.nutrients.ENERC_KCAL * quantity)} kcal
                </Text>
                {/* Nutritional Breakdown */}
                <Box mt={4}>
                  <Heading size="sm">Nutritional Breakdown (per serving):</Heading>
                  <Text>Protein: {selectedItem.food.nutrients.PROCNT ? Math.ceil(selectedItem.food.nutrients.PROCNT * quantity) : "0"} g</Text>
                  <Text>Fat: {selectedItem.food.nutrients.FAT ? Math.ceil(selectedItem.food.nutrients.FAT * quantity) : "0"} g</Text>
                  <Text>Carbohydrates: {selectedItem.food.nutrients.CHOCDF ? Math.ceil(selectedItem.food.nutrients.CHOCDF * quantity) : "0"} g</Text>
                </Box>
                

                {/* Quantity slider */}
                <Box width="25%" boxShadow = "lg">
                  <Text>Quantity: {quantity} {quantity > 9 ? `Servings (${Math.ceil(quantity * selectedItem.measures[0].weight)} grams)` : `Serving (${Math.ceil(quantity * selectedItem.measures[0].weight)} grams)`}</Text>
                  <Slider
                    min={0}
                    max={maxAllowedQuantity}
                    value={quantity}
                    step={0.5}
                    onChange={(value) => setQuantity(value)}
                    w="100%"
                
                    defaultValue = {[0]}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Box>
                {/* Meal section buttons */}
                {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((section) => (
                  <Button
                    key={section}
                    colorScheme="blue"
                    onClick={() => addItemToSection(section, { ...selectedItem, quantity})}
                    width='100%'
                    isDisabled ={quantity > 0 ? false: true}
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