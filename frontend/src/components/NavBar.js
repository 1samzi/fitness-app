import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Menu as MenuIcon, X } from 'lucide-react'
import ProfileMenu from './Profile/ProfileMenu'

const Links = [
  {
    'name': 'Dashboard',
    'link': '/home'
  }, {
    'name': 'Log Food',
    'link': '/nutrition-form'
  }, {    
    'name': 'Exercise',
    'link': '/exercise'
  }
]

const NavLink = ({ children, to }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === to

  const bgColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBgColor = useColorModeValue('gray.200', 'gray.700')
  const activeTextColor = useColorModeValue('gray.800', 'white')
  const inactiveTextColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Text
      px={2}
      py={1}
      rounded={'md'}
      bg={isActive ? bgColor : 'transparent'}
      color={isActive ? activeTextColor : inactiveTextColor}
      fontWeight={isActive ? 'bold' : 'normal'}
      _hover={{
        textDecoration: 'none',
        bg: hoverBgColor,
      }}
      cursor="pointer"
      onClick={() => navigate(to)}
    >
      {children}
    </Text>
  )
}

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgColor = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <X /> : <MenuIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>Logo</Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.name} to={link.link}>{link.name}</NavLink>
            ))}
          </HStack>
        </HStack>
        <ProfileMenu />
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.name} to={link.link}>{link.name}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}