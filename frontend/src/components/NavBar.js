import React from 'react'
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
import ProfileMenu from './ProfileMenu'
import { useNavigate } from 'react-router-dom'

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
    return (
        <Text
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            cursor="pointer"
            onClick={() => navigate(to)}
        >
            {children}
        </Text>
    )
}

function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
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

export default NavBar