import { Flex, Heading, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, ModalFooter,   AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  Text,
  Image,
  AlertDialogOverlay,
  Input,} from '@chakra-ui/react'
import { useStore } from '../store'
import React, { useState } from 'react';
import { ethers } from 'ethers'
import channelManagerAbi from '../abis/channel_manager.json'


export const CreateChannelModal = () => {
  const showCreateChannel = useStore((state) => state.showCreateChannel)
  const setShowCreateChannel = useStore((state) => state.setShowCreateChannel)
  const [message, setMessage] = useState('')
  const operatorSigner = useStore((state) => state.operatorSigner)

  const channelManager = new ethers.Contract(process.env.NEXT_PUBLIC_CHANNEL_MANAGER_CONTRACT, channelManagerAbi, operatorSigner)

  const createChannel = async (channel) => {
    console.log(operatorSigner)
    console.log('creating channel: ' + channel)
    console.log(await channelManager.createChannel(channel))
  }


if (showCreateChannel) {
  return (
    <Flex direction={'column'} zIndex={1} position={'absolute'}  w='100%' h='100%' justify={'center'}>
      <Flex position={'absolute'} w='100%' h='100%' bg='black' backdropBlur={'100%'} blur={'100%'} opacity={'65%'}></Flex>
      <Flex zIndex={1} align={'center'}  direction='column' margin={'0 auto'} w='420px' h='350px' borderRadius={'10px'} bg='#313131'>
        <Image mt='50px' w={'45px'} src={'https://i.ibb.co/M78TdLJ/add.png'}></Image>
        <Button bg='transparent' borderRadius={'50%'} position={'absolute'} ml='350px' mt='20px' w={'15px'}  onClick={() => setShowCreateChannel(false)}><Image position={'absolute'} w='40%' src={'https://i.ibb.co/b7wxVvt/x.png'}></Image></Button>        
        <Heading mt='20px' color={'white'} fontWeight={'bold'} fontSize={'20px'}>Create a Channel</Heading>
        <Flex direction={'column'} w='80%' alignItems='left' mt='30px'>
          <Heading fontSize='15px' mb={'10px'}>Channel Name</Heading>
          <Input onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              createChannel(message)
              setShowCreateChannel(false)
            }
          }} variant='filled' placeholder='e.g welcome'></Input>
        </Flex>
        <Button mt='20px' w='80%' className="btn" bg='#347BE5' type="button" onClick={() => createChannel(message)}>Create Channel</Button>
      </Flex>
    </Flex>

  )
}

}
