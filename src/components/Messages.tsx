import {
    Flex,
    Heading,
    Text,
    Avatar,
    Spacer
  } from '@chakra-ui/react'
  import { useStore } from '../store'
  import { Message } from '../types'
  import { useEffect, useState, useRef } from 'react'
  import { GoReply } from 'react-icons/go'
  import { BsFillEmojiLaughingFill } from 'react-icons/bs'
  
  interface MessagesProps {
    messages: Message[]
  }
  
  export const Messages = ({ messages }: MessagesProps) => {
    const currentChannel = useStore((state) => state.currentChannel)
    const [showButtons, setShowButtons] = useState('0rem')
    const [hoveredMessage, setHoveredMessage] = useState('')
    const replyId = useStore((state) => state.replyId)
    const setReplyId = useStore((state) => state.setReplyId)
    const addMessage = useStore((state) => state.addMessage)
    const { channelManager } = useStore((state) => state.contracts)
    const server = useStore((state) => state.server)
    const currentUser = useStore((state) => state.currentUser)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
      channelManager.on('MessageEvent', (channel, message) => {
        console.log(message.username)
        if (message.username === currentUser.name) return
        if (channel === currentChannel.name) {
          console.log('message event firing')
          // console.log(currentChannel.messages)
          const userDetails = server.members.find((member) => member.name === message.username)
          const newMessage = {
            id: message.id.toString() as string,
            content: message.message as string,
            author: {
              name: message.username,
              pfp: userDetails?.pfp,
              role: userDetails?.role,
            },
            timestamp: message.timestamp.toString() as string,
            replyTo: message.reply_id.toString() as string,
          }
        
          const existingMessages = currentChannel.messages.map(m => m.id)
          if (!existingMessages.includes(newMessage.id)) {
            addMessage(newMessage)
          }
        }
      })
      return () => {
        channelManager.removeAllListeners()
      }
    }, [])
  
    // TODO: add reply functionality
    const messageList = messages.map((message) => {
      // console.log(message)
      const { id, author, content, timestamp } = message
      const date = new Date(parseInt(timestamp) * 1000)
      const day = date.toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : date.toLocaleDateString()
      const time = date.toLocaleTimeString().split(':')
      const hours = time[0] + ':' + time[1]
      const ampm = time[2].split(' ')[1]
      // const messageId = author.name + timestamp + content
      let reply
      if (message.replyTo !== '0') {
        const replyMsg = messages.find((m) => m.id === message.replyTo)
        reply = (
          <Flex ml='3.5rem' align='center' mb='.5rem'>
            <Avatar size={'xs'} src={replyMsg?.author.pfp} />
            <Text ml='10px' color={author.role === 'admin' ? '#347BE5' : '#8E9297'} fontSize='.9rem' as='b'>{replyMsg?.author.name}</Text>
            <Text ml='10px' color='#fff' fontSize='.8rem'>{replyMsg?.content}</Text>
          </Flex>
        )
      }

      return (
        <Flex
          justify='center'
          px='1.5rem'
          py='.5rem'
          key={id}
          _hover={{
            bg: '#393A3E'
          }}
          bg={(id === replyId && id !== '0') ? '#3f414c' : 'transparent'}
          onMouseEnter={() => {
            setHoveredMessage(id)
            setShowButtons('2rem')
          }}
          onMouseLeave={() => {
            setHoveredMessage('')
            setShowButtons('none')
          }}
          direction='column'
        >
          {reply}
          <Flex>
            <Avatar src={author.pfp} />
            <Flex direction='column'>
              <Flex align='center'>
                <Text ml='10px' color={author.role === 'admin' ? '#347BE5' : '#8E9297'} fontSize='1.1rem' as='b'>{author.name}</Text>
                <Text ml='10px' color='#8E9297' fontSize='.8rem'>{day + ' ' + hours + ' ' + ampm}</Text>
              </Flex>
    
              <Text ml='10px' color='#fff' size='1.1rem'>{content}</Text>
            </Flex>
            <Spacer />
            <Flex
              _hover={{
                bg: '#3f414c'
              }}
              borderRadius='5px'
              p='.5rem'
              mr='1rem'
            >
              <GoReply
                fontSize={id === hoveredMessage ? showButtons : '0rem'}
                color='#8E9297'
                onClick={() => {
                  setReplyId(id)
                  scrollToBottom()
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      )
    })
    return (
      <Flex w='100%' direction='column'>
        {messageList}
        <div ref={messagesEndRef} />
      </Flex>
    )
  }
  