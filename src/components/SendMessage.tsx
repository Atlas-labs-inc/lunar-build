import {
    Flex,
    Heading,
    Text,
    Spacer,
    Input,
    IconButton
  } from '@chakra-ui/react'
  import { useStore } from '../store'
  import { useRef, useState, useEffect } from 'react'
  import { AiFillCloseCircle } from 'react-icons/ai'
  import cookies from '../cookies'
  import { Contract, Web3Provider, Provider, Wallet } from "zksync-web3";
  import channelManagerABI from '../abis/channel_manager.json'
  import profileABI from "../abis/profile.json"
  import { ethers } from 'ethers'
  import axios from 'axios';

  export const SendMessage = () => {
    const currentChannel = useStore((state) => state.currentChannel)
    const currentUser = useStore((state) => state.currentUser)
    const [message, setMessage] = useState('')
    const replyId = useStore((state) => state.replyId)
    const setReplyId = useStore((state) => state.setReplyId)
    const addMessage = useStore((state) => state.addMessage)
    
    const sendNotificationToUser = async (respond_user, message_contract, profile_contract, channel, message_id: string, message_value: string) => {
      const replied_message = await message_contract.getMessage(channel, message_id);
      const replied_user_address = (await profile_contract.getUser(replied_message.username));
      await axios.post('/api/push-notification', {
        address: replied_user_address.main_wallet,
        title: `${respond_user} replied to you!`,
        body: message_value
      });
    }

    const sendMessageToChain = (message: string) => {
      const wallet = new Wallet(
        cookies.get('operatorKey'),
        new Provider(process.env.NEXT_PUBLIC_Pl2),
        new ethers.providers.JsonRpcProvider(process.env.PL1)
      );
      const contract = new Contract(
        process.env.NEXT_PUBLIC_CHANNEL_MANAGER_CONTRACT,
        channelManagerABI,
        wallet
      );

      const time = new Date()

      const msg = {
        id: time.getTime().toString(),
        content: message,
        author: {
          name: currentUser.name,
          pfp: currentUser.pfp,
          role: currentUser.role,
        },
        // timestamp: time.toString(),
        timestamp: Math.floor(time.getTime() / 1000).toString(),
        replyTo: replyId,
      }

      addMessage(msg)

      contract.newMessage(currentChannel.name, {
        username: currentUser.name,
        message: message,
        reply_id: parseInt(replyId),
        media: ''
      }).then((tx) => {
        tx.wait().then((receipt) => {
          // TODO: add message to list while waiting for contract call
          if(parseInt(replyId) != 0){
            sendNotificationToUser(currentUser.name, contract, new Contract(
              process.env.NEXT_PUBLIC_PROFILE_CONTRACT,
              profileABI,
              wallet
            ), currentChannel.name, replyId, message);
          }
          console.log('sent!')
        })
      })
      
      console.log(message)
      setReplyId('0')
    }

    const replyUser = replyId !== '0' ? currentChannel.messages.find((message) => message.id === replyId)?.author : null

    const replyDialog = replyId !== '0' ? (
      <Flex w='100%' h='45px' bg='#212225' align='center' px='1rem' borderRadius='10px'>
        <Text color='#8E9297' fontSize='1rem'>{'Replying to'}</Text>
        <Text ml='5px' color={replyUser.role === 'admin' ? '#347BE5' : null} fontSize={'1rem'} as='b'>{replyUser.name}</Text>
        <Spacer />
        <IconButton bg='transparent' onClick={() => { setReplyId('0') }} aria-label='close' icon={<AiFillCloseCircle color='#fff' />} />
      </Flex>
    ) : null
  
    return (
      <Flex w='95%' mb='2rem' mt='1rem' mx='1.5rem' bg='#292A2E' align='center' direction={'column'}>
        {replyDialog}
        <Input
          h='55px'
          value={message}
          bg='#393A3E'
          variant='filled'
          placeholder='Hello EthGlobal...'
          color='#fff'
          onChange={(e) => setMessage(e.target.value)}
          _hover={{
            bg: '#393A3E'
          }}
          _focus={{
            bg: '#393A3E'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessageToChain(message)
              setMessage('')
            }
          }}
        />
      </Flex>
    )
  }