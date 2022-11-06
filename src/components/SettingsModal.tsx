import { Flex, Heading, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, ModalFooter,   AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  Text,
  Image,
  Avatar,
  AlertDialogOverlay,
  Input,
  Textarea,} from '@chakra-ui/react'
import { useStore } from '../store'
import React, { useState, useEffect, useRef } from 'react';
import { Contract, Web3Provider, Provider, Wallet } from "zksync-web3";
import { useMetaMask } from 'metamask-react'
import profileABI from '../abis/profile.json'
import cookies from '../cookies';
import { NFTStorage } from 'nft.storage';


export const SettingsModal = () => {
  const showSettingsModal = useStore((state) => state.showSettingsModal)
  const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)
  const currentUser = useStore((state) => state.currentUser)
  const [message, setMessage] = React.useState('')
  const contract = useStore((state) => state.contract)
  const updateBio = useStore((state) => state.updateBio)
  const upadtePfp = useStore((state) => state.updatePfp)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENBNzNBN2E5OTMwYzlGNzZhRkU2Mjg2Q2JEYmY3ZTg4Mzk4ZTI3MzciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NzcwOTI2MDQxOCwibmFtZSI6ImJyb3dzZXJfa2V5In0.VIgC8IxxNy9AB8uKxmLj0Ya2W8VoFVWLhgmL8Cl0Mzo'

  const fileUploadHandler = async (event) => {
    console.log("File Uploding...")
    console.log(event.target.files[0])
    const store = new NFTStorage({ token })
    const cid = await store.storeDirectory(event.target.files)
    const name = event.target.files[0].name;
    const link = `https://${cid}.ipfs.nftstorage.link/${name}`
    console.log(link)
    upadtePfp(link)
    console.log(await (await contract.updateProfilePicture(currentUser.name, link)).wait())
    console.log("File Uploaded to IPFS...")
  }

  const updateBioFunc = async (bio) => {
    console.log("updating bio...")
    setShowSettingsModal(false)
    try {
        console.log(currentUser.name)
        console.log(bio)
        console.log(await contract.updateBio(currentUser.name, bio))
        updateBio(bio)
        console.log('Bio updated successfully!')
    } catch (error) {
      console.log(error)
        console.log('Error updating bio...');
    }
  }


if (showSettingsModal) {
  return (
    <Flex direction={'column'} zIndex={1} position={'absolute'}  w='100%' h='100%' justify={'center'}>
      <Flex position={'absolute'} w='100%' h='100%' bg='black' backdropBlur={'100%'} blur={'100%'} opacity={'60%'} onClick={() => setShowSettingsModal(false)}></Flex>
      <Flex zIndex={1} align={'center'}  direction='column' margin={'0 auto'} w='420px' h='520px' borderRadius={'10px'} bg='#313131'>
      <Flex justify={'center'} mb='10px' mt='25px' w='60%' h='20px'>
          <Button>          <Input
              id='imgupld'
              type="file"
              onChange={fileUploadHandler}
              height="100%"
              width="100%"
              position={'absolute'}
              aria-hidden="true"
              accept="image/*"
              opacity="0"
            />Change Profile Picture</Button>
        </Flex>
        <Avatar ml={'3px'} mt='30px' w={'120px'} h={'120px'} src={currentUser.pfp} />
        <Button bg='transparent' borderRadius={'50%'} position={'absolute'} ml='350px' mt='20px' w={'15px'}  onClick={() => setShowSettingsModal(false)}><Image position={'absolute'} w='40%' src={'https://i.ibb.co/b7wxVvt/x.png'}></Image></Button>        
        <Heading mt='10px' color={'white'} fontWeight={'bold'} fontSize={'20px'}>{currentUser.name}</Heading>
        <Heading mt='10px' color={'gray'} fontWeight={'medium'} fontSize={'14px'}>{currentUser.bio}</Heading>
        <Flex direction={'column'} w='80%' alignItems='left' mt='20px'>
          <Heading fontSize='15px' mb={'10px'}>Update Bio</Heading>
          <Textarea onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateBioFunc(message)
            }
          }} h='100px' variant='filled' ></Textarea>
        </Flex>
        <Button mt='30px' w='50%' className="btn" bg='#347BE5' type="button" onClick={() => updateBioFunc(message)} >Save Settings</Button>

        
      </Flex>
    </Flex>

  )
}

}
