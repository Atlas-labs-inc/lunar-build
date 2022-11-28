import {
  Flex,
  Heading,
  useDisclosure,
  Button,
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
  const signer = useStore((state) => state.signer)
  const showSettingsModal = useStore((state) => state.showSettingsModal)
  const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)
  const currentUser = useStore((state) => state.currentUser)
  const currentChannel = useStore((state) => state.currentChannel)
  const [message, setMessage] = React.useState('')
  const [contract, setContract] = useState(null)
  const updateBio = useStore((state) => state.updateBio)
  const updatePfp = useStore((state) => state.updatePfp)
  const updateMessages = useStore((state) => state.updateMessages)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const updateMembers = useStore((state) => state.updateMembers)
  const server = useStore((state) => state.server)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (signer && !contract) {
      const provider = new Provider(process.env.NEXT_PUBLIC_Pl2);
      const operatorWallet = new Wallet(cookies.get('operatorKey'), provider);
      const op = new Contract(
        process.env.NEXT_PUBLIC_PROFILE_CONTRACT,
        profileABI,
        operatorWallet
        );
      setContract(op)
    }
  }, [signer])

  const fileUploadHandler = async (event) => {
    setLoading(true)

    if (event.target.files.length < 1) return

    const store = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN });
    const cid = await store.storeDirectory(event.target.files)
    const name = event.target.files[0].name;
    const link = `https://${cid}.ipfs.nftstorage.link/${name}`
    const request = await contract.updateProfilePicture(currentUser.name, link)
    request.wait().then((result) => {
      console.log("File Uploaded to IPFS...")

      updatePfp(link)
      setLoading(false)

      const newMembers = server.members.map((member) => {
        if (member.name == currentUser.name) {
          member.pfp = link
        }
        return member
      })
      updateMembers(newMembers)
      const newMessages = currentChannel.messages.map((message) => {
        if (message.author.name == currentUser.name) {
          message.author.pfp = link
        }
        return message
      })
      updateMessages(newMessages)
    })
  }

  const updateBioFunc = async (bio) => {
    setShowSettingsModal(false)
    try {
        const request = await contract.updateBio(currentUser.name, bio)
        request.wait().then((result) => {
          updateBio(bio)
        })
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
          <Button isLoading={loading}>
            <Input
              id='imgupld'
              type="file"
              onChange={fileUploadHandler}
              height="100%"
              width="100%"
              position={'absolute'}
              aria-hidden="true"
              accept="image/*"
              opacity="0"
            />
              Change Profile Picture
            </Button>
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
