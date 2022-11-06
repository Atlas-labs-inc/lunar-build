import {
    Box,
    Flex,
    Heading,
    Image,
    Text,
    Button
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useStore } from '../store'
  
  export const ServerInfo = () => {
    const server = useStore((state) => state.server)
    const currentChannel = useStore((state) => state.currentChannel)
    const setCurrentChannel = useStore((state) => state.setCurrentChannel)

    const currentUser = useStore((state) => state.currentUser)
    const showCreateChannel = useStore((state) => state.showCreateChannel)
    const setShowCreateChannel = useStore((state) => state.setShowCreateChannel)
    const setLoadingMessages = useStore((state) => state.setLoadingMessages)

    const { channelManager } = useStore((state) => state.contracts)

    const [clickedChannel, setClickedChannel] = useState(null)

    if (server) {

    const getChannelInfo = (channelName: string) => {
      setClickedChannel(channelName)
      setLoadingMessages(true)
      channelManager.getMessagesPaginated(channelName, 0, 100).then((messages) => {

        const parsedMessages = messages.map((message) => {
          if (message.message === '') {
            return null
          }
          const userDetails = server.members.find((member) => member.name === message.username)
          return {
            id: message.id.toString() as string,
            content: message.message,
            author: {
              name: message.username,
              pfp: userDetails.pfp,
              role: userDetails.role,
            },
            timestamp: message.timestamp.toString(),
          }
        }).filter((message) => message !== null)

      setCurrentChannel({
        name: channelName,
        messages: parsedMessages
      })
      setLoadingMessages(false)
      setClickedChannel(null)
    })
  }

    const channels = server?.channels.map((channel) => {
        if (channel == currentChannel?.name) { // selected channel
            return (
              <Flex key={channel}>
                <Button
                  justifyContent={'left'}
                  w={'240px'}
                  h={'30px'}
                  backgroundColor={clickedChannel ? 'transparent' : '#36393F'}
                  marginLeft='10px'
                  marginTop='0px'
                  color={clickedChannel ? '#8E9297' : '#fff'}
                  fontWeight={'bold'}
                  fontSize={'15px'}
                  borderRadius='4px'
                >
                  <Text fontWeight={clickedChannel ? 'medium' : 'black'}>
                    {'# ' + channel}
                  </Text>
                </Button>
              </Flex>
            )
          } else { // other channels
            return (
              <Flex key={channel}>
                <Button
                  onClick={() => getChannelInfo(channel)}
                  justifyContent={'left'}
                  w={'240px'}
                  h={'30px'}
                  backgroundColor={clickedChannel === channel ? '#36393f' : 'transparent'}
                  marginLeft='10px'
                  marginTop='0px'
                  color={clickedChannel === channel ? '#fff' : '#8E9297'}
                  fontWeight={clickedChannel === channel ? 'black' : 'medium'}
                  fontSize={'15px'}
                  borderRadius='4px'
                >
                  # {channel}
                </Button>
              </Flex>
            )
          }
    })

    const createChannel = currentUser.role ? (
      <Button bg='transparent' w='30px' h={'30px'} onClick={() => setShowCreateChannel(true)}  marginLeft={'7.8vw'} marginTop='-0.2vw'  ><Image w='10px' src='https://i.ibb.co/YbVFDqN/Plus.png' ></Image></Button>
    ) : null
  
    return (
      <Flex direction={'column'} w='17%' h='100vh' bg='#212225'>
        <Image src={server.banner}></Image>
        <Flex marginLeft='8px' marginTop='8px' alignItems='center' justifyContent='left'>
              <Image w={'30px'} src={'https://i.ibb.co/M1MKW6j/Server-Badge.png'}></Image>
              <Heading marginLeft='2px' fontSize={'22px'} paddingBottom='2px'>{server.name}</Heading>
        </Flex>
        <Text marginLeft='40.8px' marginTop={'-3px'} color={'#A8A8A8'} fontWeight={'medium'} fontSize={'12px'}>{server.members.length} Members</Text>
        <Flex marginTop={'10px'}>
            <Text marginLeft='10px' color={'#A8A8A8'} fontWeight={'bold'} fontSize={'15px'}>Channels:</Text>
            {createChannel}
        </Flex>
        <Flex direction={'column'} marginTop={'5px'}>
          {channels}
        </Flex>
      </Flex>
    )
    } else {
      return null
    }
  }