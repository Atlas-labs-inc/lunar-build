import { Flex, Heading, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, ModalFooter,   AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  Text,
  Image,
  Avatar,
  Switch,
  AlertDialogOverlay,
  Input,} from '@chakra-ui/react'
import { useStore } from '../store'
import React, { useState } from 'react';

export const ProfileModal = () => {
  const showProfileModal = useStore((state) => state.showProfileModal)
  const setShowProfileModal = useStore((state) => state.setShowProfileModal)
  const currentUser = useStore((state) => state.currentUser)
  const currentProfile = useStore((state) => state.currentProfile)
  const [switchValue, setSwitchValue] = React.useState(false)
  const contract = useStore((state) => state.contract)
  const [isMod, setIsMod] = React.useState(false)


  const changeSwitch = async () => {
    setSwitchValue(!switchValue)
    console.log(switchValue)
    console.log(currentProfile.name)
    console.log(await contract.updateModeratorStatus(currentProfile.name, switchValue))
  }

  const getAdminStatus = async () => {
    const data = await contract.getUser(currentUser.name)
    if (data.is_moderator){
      setIsMod(true)
    } else {{
      setIsMod(false)
    }}
  }

  const AdminToggle = () => {
    getAdminStatus()
    if (isMod){
      return(
        <Flex align={'center'} justify={'center'} direction={'column'} position={'absolute'} mr='300px' mt='20px' w={'70px'} h='50px'>
          <Heading mb='8px' color='gray' fontSize={'12px'}>Admin</Heading>
          {currentProfile.role === 'admin' ? <Switch defaultChecked onChange={() => changeSwitch()} colorScheme={'green'} size='lg' /> : <Switch  onChange={() => changeSwitch()} colorScheme={'green'} size='lg' />}
        </Flex>
      )
    } else {
      return(
        null
      )
    }


  }

if (showProfileModal) {
  return (
    <Flex direction={'column'} zIndex={1} position={'absolute'}  w='100%' h='100%' justify={'center'}>
      <Flex position={'absolute'} w='100%' h='100%' bg='black' backdropBlur={'100%'} blur={'100%'} opacity={'60%'}  onClick={() => setShowProfileModal(false)}></Flex>
      <Flex zIndex={1} align={'center'}  direction='column' margin={'0 auto'} w='420px' h='350px' borderRadius={'10px'} bg='#313131'>
      <Avatar ml={'3px'} mt='70px' w={'150px'} h={'150px'} src={currentProfile.pfp} />
        <AdminToggle />
        <Button bg='transparent' borderRadius={'50%'} position={'absolute'} ml='350px' mt='20px' w={'15px'}  onClick={() => setShowProfileModal(false)}><Image position={'absolute'} w='40%' src={'https://i.ibb.co/b7wxVvt/x.png'}></Image></Button>        
        <Heading mt='25px' color={'white'} fontWeight={'bold'} fontSize={'20px'}>{currentProfile.name}</Heading>
        <Heading mt='10px' textAlign={'center'} w='80%' color={'gray'} fontWeight={'medium'} fontSize={'14px'}>{currentProfile.bio}</Heading>
        <Flex justify={'center'} mt='30px'>
        </Flex>
      </Flex>
    </Flex>

  )
}

}
