import { Flex, Heading } from '@chakra-ui/react'
import { useStore } from '../store'
import { OnlineUsers } from './OnlineUsers'
import { User } from './User'

export const UserPanel = () => {

  return (
    <Flex w='15%' h='100vh' style={{ overflowY: 'scroll' }} bg='#000'>
      <Flex direction='column' w='100%' h='100%'>
        <User />
        <OnlineUsers />
      </Flex>
    </Flex>
  )
}