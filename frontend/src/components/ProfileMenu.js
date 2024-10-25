import React from 'react'
import {
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react'
import { MoreVertical } from 'lucide-react'
import { useNavigation } from 'react-router-dom'

function ProfileMenu() {
  return (
    <Flex alignItems={'center'} gap={2}>
      <Avatar
        size={'md'}
        src={
          'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
        }
      />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label={'More options'}
          icon={<MoreVertical size={20} />}
          variant={'ghost'}
          size={'sm'}
        />
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuDivider />
          <MenuItem >Sign out</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default ProfileMenu