import React from 'react'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import NutritionForm from './components/Food/NutritionForm'
import Exercise from './components/Exercise/Exercise'
import Profile from './components/Profile/Profile'
import Setting from './components/Profile/Setting'
import ForgotPassword from './components/ForgotPassword'
import VerifyForgotPassword from './components/VerifyForgotPassword'
import TwoFactorAuth from './components/Admin/TwoFactorAuth'
import AdminHome from './components/Admin/AdminHome'
import UserActivity from './components/Admin/UserActivity'

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
            <Route path='/profile' element={<Profile />} />
            <Route path='/setting' element={<Setting />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
            <Route path='/admin-home' element={<AdminHome />} />
            <Route path='/user-activity' element={<UserActivity />} />
            <Route path='/verify-forgot-password/:email' element={<VerifyForgotPassword />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App