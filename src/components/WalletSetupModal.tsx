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
import React, { useEffect, useState } from 'react';
import { useMetaMask } from 'metamask-react'
import { statSync } from 'fs';
import cookies from '../cookies';
import crypto from 'crypto';
import { utils, Wallet, Provider} from "zksync-web3";
import { ethers } from "ethers";
import axios from 'axios';
import { SetUsernameModal } from './SetUsernameModal';
import { Contract, Web3Provider } from "zksync-web3";
import { userAgent } from 'next/server';
import profileABI from '../abis/profile.json'


export const WalletSetupModal = () => {
  const currentUser = useStore((state) => state.currentUser)
  const showModal1 = useStore((state) => state.showModal1)
  const setShowModal1 = useStore((state) => state.setShowModal1)
  const showSetUsernameModal = useStore((state) => state.showSetUsernameModal)
  const setShowSetUsernameModal = useStore((state) => state.setShowSetUsernameModal)
  const [ executed, setExecuted] = useState(false)
  const newUserStatus = useStore((state) => state.newUserStatus)
  const OPAddress = useStore((state) => state.OPAddress)
  const setOPAddress = useStore((state) => state.setOPAddress)
  const wasConnected = useStore((state) => state.wasConnected)
  const setWasConnected = useStore((state) => state.setWasConnected)
  const { addChain } = useMetaMask();
  const [chainAdded, setChainAdded] = useState(false)
  const setSigner = useStore((state) => state.setSigner)
  const setOperatorSigner = useStore((state) => state.setOperatorSigner)
  const signer = useStore((state) => state.signer)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  

  const provider = new Provider(process.env.NEXT_PUBLIC_Pl2);


  const WrongNetwork = async () =>{
    const ChainNetworkParams = {
      chainId: "0x10E",
      chainName: "Lunar Chain",
      rpcUrls: ["https://a4f4-3-87-1-255.ngrok.io/"],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://blockscout.com/xdai/mainnet/"]
    };
    const result = await addChain(ChainNetworkParams)
    console.log(result)
    if (result === undefined) {
      setChainAdded(true)
    }
  }

  const checkChainID = async () => {
    if (chainId != '0x10e') {
      console.log("Wrong Network!")
      WrongNetwork()
    }
  }

  checkChainID()

  const checkBalance = async (privateKey) => {
    const provider = new Provider(process.env.NEXT_PUBLIC_Pl2)
    const wallet = new Wallet(privateKey, provider, new ethers.providers.JsonRpcProvider(process.env.PL1));
    const operatorBalance = await wallet.getBalance()
    const userBalance = await provider.getBalance(account)
    const signer = await (new Web3Provider(ethereum)).getSigner();
    const operatorSigner = await (new Wallet(
      cookies.get('operatorKey'),
      new Provider(process.env.NEXT_PUBLIC_Pl2),
      new ethers.providers.JsonRpcProvider(process.env.PL1)
    ))
    setSigner(signer)
    setOperatorSigner(operatorSigner)

    setOPAddress(wallet.address)

    console.log("Operator Balance: " + operatorBalance)
    console.log("User Balance: " + userBalance)

    if ((await provider.getBalance(account)).lt(ethers.utils.parseEther("0.01"))) {   //Check if Metsmask has at least 0.01 ETH
      console.log("(Metamask) requesting funds... " + account)
      console.log(await fundWallet(account))
    } else{
      console.log(account + " - Metamask wallet above 0.01 ETH ")
    }

    if (operatorBalance.lt(ethers.utils.parseEther("0.01"))) {   //Check if operator has at least 0.01 ETH
      console.log("(Operator) requesting funds... " + wallet.address)
      await fundWallet(wallet.address)
    } else{
      console.log(wallet.address +" - Operator wallet above 0.01 ETH")
    }
  
    return true
  }

  const fundWallet = async (walletAddress) => {
    return await axios.post('/api/fund', {main_address: walletAddress})
  }

  const startBalanceCheck = async () => {
    if (!executed) {
        setExecuted(true)
        if (status === 'connected') {
          if (cookies.get('operatorKey') === undefined) {
            cookies.set('operatorKey', "0x"+crypto.randomBytes(32).toString('hex'), { path: '/' })
          }
          checkBalance(cookies.get('operatorKey'))
        }        
      }
  }

  const walletConnected = async () => {
    if (status === 'connected') { //wallet connected
      console.log("Metamask Connected")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      await startBalanceCheck()
      setWasConnected(true)
      setShowModal1(false)
      if (currentUser.name === null || currentUser.name === undefined) { //user has not set username
        setShowSetUsernameModal(true)
      }
    } else {
      setShowModal1(true) //show connect wallet button if they arent connected
    }
  }


  walletConnected() 

if (showModal1) {
  return (
    <Flex direction={'column'} zIndex={1} position={'absolute'}  w='100%' h='100%' justify={'center'}>
      <Flex position={'absolute'} w='100%' h='100%' bg='black' backdropBlur={'100%'} blur={'100%'} opacity={'60%'}></Flex>
      <Flex zIndex={1} align={'center'}  direction='column' margin={'0 auto'} w='420px' h='360px' borderRadius={'10px'} bg='#313131'>
        <Image mt='20px' w={'200px'} src={'https://i.ibb.co/PwbLCH8/lunar-logo-2-1.png'}></Image>
        <Heading mt='0px' color={'#B9BBBE'} fontWeight={'medium'} fontSize={'15px'}>Welcome to</Heading>
        <Heading mt='0px' color={'white'} fontWeight={'bold'} fontSize={'45px'}>Lunar</Heading>
        <Text mt='10px' textAlign={'center'} w='80%' color={'#C4C4C4'} fontWeight={'medium'} fontSize={'13px'}>To get started, you'll need to set up your wallet.</Text>
        {(chainId != '0x10e') && <Button disabled mt='25px' w='80%' className="btn" bg='gray' type="button" onClick={connect}>Connect Metamask</Button>}
        {(chainId === '0x10e') && <Button mt='25px' w='80%' className="btn" bg='#347BE5' type="button" onClick={connect}>Connect Metamask</Button>}
      </Flex>
    </Flex>

  )
} else if (showSetUsernameModal && newUserStatus) {
  return (
    <SetUsernameModal />
  )
}

}
