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
import profileABI from '../abis/profile.json'
import { Contract, Web3Provider, Provider, Wallet } from "zksync-web3";


export const ProfileModal = () => {
  const showProfileModal = useStore((state) => state.showProfileModal)
  const setShowProfileModal = useStore((state) => state.setShowProfileModal)
  const currentUser = useStore((state) => state.currentUser)
  const currentProfile = useStore((state) => state.currentProfile)
  const signer = useStore((state) => state.signer)
  const opContract = useStore((state) => state.opContract)
  const updateMembers = useStore((state) => state.updateMembers)
  const server = useStore((state) => state.server)

  const madeAdmin = async () => {
    console.log(currentProfile.name)
    opContract.updateModeratorStatus(currentProfile.name, true).then((result) => {
      console.log(result)
      const newMembers = server.members.map((member) => {
        if (member.name == currentProfile.name) {
          member.role = 'admin'
        }
        return member
      })
      updateMembers(newMembers)
    })
  }

  const madeMember = async () => {
    console.log(currentProfile.name)
    opContract.updateModeratorStatus(currentProfile.name, false).then((result) => {
      console.log(result)
      const newMembers = server.members.map((member) => {
        if (member.name == currentProfile.name) {
          member.role = 'member'
        }
        return member
      })
      updateMembers(newMembers)
    })
  }

  const AdminToggle = () => { 
    console.log(currentUser.role)
    console.log(currentProfile.role) 
    if(currentUser.role == 'true') {
      if (currentProfile.role === 'admin'){
        return(
          <Flex align={'center'} justify={'center'} direction={'column'} position={'absolute'} ml='35px' mr='300px' mt='10px' w={'70px'} h='50px'>
            {/* <Heading mb='8px' color='gray' fontSize={'12px'}>Admin</Heading> */}
            {(currentProfile.name != currentUser.name) && < Button onClick={() => {madeMember(); setShowProfileModal(false);}} w='120px' ml='8px' mb='-6px' colorScheme={'gray'} size='sm' >Make Member</Button>}
          </Flex>
        )
      } else {
        return(
          <Flex align={'center'} justify={'center'} direction={'column'} position={'absolute'} mr='300px' mt='20px' w={'70px'} h='50px'>
          <Button onClick={() => {madeAdmin(); setShowProfileModal(false);}} w='100px' ml='15px' mb='12px' bg={'#307BF4'} color={'white'} size='sm' >Make Admin</Button>
        </Flex>
        )
      }
    } else {
      return(null)
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
