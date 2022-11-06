import {
    Flex,
    Text,
    Image,
    Spacer,
    IconButton,
    Avatar
  } from '@chakra-ui/react'
  import { useStore } from '../store'
  import { IoMdSettings } from 'react-icons/io'
  import { SettingsModal } from './SettingsModal'

  export const User = () => {
    const currentUser = useStore((state) => state.currentUser)
    const showSettings = useStore((state) => state.showSettingsModal)
    const setShowSettings = useStore((state) => state.setShowSettingsModal)

    return (
      <Flex w='100%' h='65px' bg='#212225' align='center' justify='center' pt='1.5rem'>
        <Flex  w='100%' direction='row' h='100%' align='center' justify='center' mx='1rem'>
          <Avatar ml={'3px'} w={'35px'} h={'35px'} src={currentUser.pfp} />
          <Text ml='8px' color='#fff' fontWeight={'bold'} fontSize='13px' as='b'>{currentUser.name}</Text>
          <Spacer />
          <IconButton onClick={() => setShowSettings(true)}  aria-label='settings' backgroundColor={'transparent'} icon={<IoMdSettings />} />
        </Flex>
      </Flex>
    )
  }