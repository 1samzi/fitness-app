import React from 'react'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import NutritionForm from './components/Food/NutritionForm'
import Exercise from './components/Exercise/Exercise'

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <ChakraProvider>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route 
              path="/home" 
              element={<Home/>}
              // element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/nutrition-form' element={<NutritionForm/>} />
            <Route path='/exercise' element={<Exercise/>} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App