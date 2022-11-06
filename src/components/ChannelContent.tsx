import {
    Flex,
    Heading,
    Text,
    Spacer,
    Button,
    Spinner
  } from '@chakra-ui/react'
import { useStore } from '../store'
import { Messages } from './Messages'
import { SendMessage } from './SendMessage'
import { useRef, useEffect } from 'react'

  export const ChannelContent = () => {
    const currentChannel = useStore((state) => state.currentChannel)
    const loadingMessages = useStore((state) => state.loadingMessages)
  
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    useEffect(() => {
      scrollToBottom()
    });

    const spinner = (
      <Flex w='100%' h='100%' justify='center' align='center'>
        <Spinner color='red.500' />
      </Flex>
    )

    const body = (
      <Flex direction='column' w='100%' h='100%'>
        <Flex w='100%' h='60px' align='center' mt='1rem'>
          <Button justifyContent={'left'} w={'200px'} h={'36px'} backgroundColor='#36393F' marginLeft='22px' marginTop='1rem' color={'white'} fontWeight={'bold'} fontSize={'18px'} borderRadius='4px'><Text fontWeight={'black'}>#&#160;</Text>{currentChannel.name}</Button>
        </Flex>

        <Spacer />
        <Flex my='1rem' w='100%' bg='#292A2E' direction='column'>
          <Text mx='1.5rem' fontSize={'2rem'} as='b' color='#fff'>{'Welcome to # ' + currentChannel.name}</Text>
          <Messages messages={currentChannel.messages} />
          <div ref={messagesEndRef} />
          <SendMessage />
        </Flex>
      </Flex>
    )

    return (
      <Flex w='70%' h='100vh' style={{ overflowY: 'scroll' }} bg='#292A2E'>
        {loadingMessages ? spinner : body}
      </Flex>
    )
  }
  