import { Flex, Heading, Button, 
  Text,
  Image,
} from '@chakra-ui/react'
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
  const newUserStatus = useStore((state) => state.newUserStatus)
  const setOPAddress = useStore((state) => state.setOPAddress)
  const wasConnected = useStore((state) => state.wasConnected)
  const { addChain } = useMetaMask();
  const [chainAdded, setChainAdded] = useState(false)
  const setSigner = useStore((state) => state.setSigner)
  const setOperatorSigner = useStore((state) => state.setOperatorSigner)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [loading, setLoading] = useState(false)
  
  const ChainNetworkParams = {
    chainId: "0x10E",
    chainName: "Lunar Chain",
    rpcUrls: [process.env.NEXT_PUBLIC_Pl2],
    
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    //blockExplorerUrls: ["https://blockscout.com/xdai/mainnet/"] 
  };

  const addLunarChain = async () =>{
    console.log("Wrong Network!")
    addChain(ChainNetworkParams).then((result) => {
      console.log(result)
      // if (val === undefined) {
      //   setChainAdded(true)
      // }
    },
    (error) => {
      console.log(error)
    }
    )
  }

  const checkBalance = async (privateKey) => {
    const provider = new Provider(process.env.NEXT_PUBLIC_Pl2)
    const operatorWallet = new Wallet(privateKey, provider, new ethers.providers.JsonRpcProvider(process.env.PL1));
    const operatorBalance = await operatorWallet.getBalance()
    const userBalance = await provider.getBalance(account)
    const signer = await (new Web3Provider(ethereum)).getSigner();

    setSigner(signer)
    setOperatorSigner(operatorWallet)

    setOPAddress(operatorWallet.address)

    // console.log("Operator Balance: " + operatorBalance)
    // console.log("User Balance: " + userBalance)

    if ((await provider.getBalance(account)).lt(ethers.utils.parseEther("0.01"))) {   //Check if Metsmask has at least 0.01 ETH
      console.log("(Metamask) requesting funds... " + account)
      fundWallet(account).then(val => {
        console.log("Metamask Balance: " + val)
        // console.log("metamask Balance after funding: " + userBalance)
      })    
    } else{
        console.log(account + " - Metamask wallet above 0.01 ETH ")
        setShowModal1(false)    
    }

    if (operatorBalance.lt(ethers.utils.parseEther("0.01"))) {   //Check if operator has at least 0.01 ETH
      console.log("(Operator) requesting funds... " + operatorWallet.address)
      fundWallet(operatorWallet.address).then(val => {
        console.log("Operator Balance: " + val)
        setShowModal1(false)
      })
    } else{
      console.log(operatorWallet.address +" - Operator wallet above 0.01 ETH")
      setShowModal1(false)
    }
    

    return true
  }

  const fundWallet = async (walletAddress) => {
    return await axios.post('/api/fund', {main_address: walletAddress})
  }

  const startBalanceCheck = async () => {

      if (cookies.get('operatorKey') === undefined) {
        cookies.set('operatorKey', "0x"+crypto.randomBytes(32).toString('hex'), { path: '/' })
      }
      checkBalance(cookies.get('operatorKey'))
  }

  const walletConnected = async () => {
    if (status === 'connected') { //wallet connected
      console.log("Metamask Connected")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      startBalanceCheck().then(val => {
        setLoading(true)
        if (currentUser.name === null || currentUser.name === undefined) { //user has not set username
          setShowSetUsernameModal(true)
        }
      })

    } else {
      setShowModal1(true) //show connect wallet button if they arent connected
    }
  }

  
  useEffect(() => {
    walletConnected() 
  }, [status])



if (showModal1) {
  return (
    <Flex direction={'column'} zIndex={1} position={'absolute'}  w='100%' h='100%' justify={'center'}>
      <Flex position={'absolute'} w='100%' h='100%' bg='black' backdropBlur={'100%'} blur={'100%'} opacity={'60%'}></Flex>
      <Flex zIndex={1} align={'center'}  direction='column' margin={'0 auto'} w='420px' h='410px' borderRadius={'10px'} bg='#313131'>
        <Image mt='20px' w={'200px'} src={'https://i.ibb.co/PwbLCH8/lunar-logo-2-1.png'}></Image>
        <Heading mt='0px' color={'#B9BBBE'} fontWeight={'medium'} fontSize={'15px'}>Welcome to</Heading>
        <Heading mt='0px' color={'white'} fontWeight={'bold'} fontSize={'45px'}>Lunar</Heading>
        <Text mt='10px' textAlign={'center'} w='80%' color={'#C4C4C4'} fontWeight={'medium'} fontSize={'13px'}>To get started, you'll need to set up your wallet.</Text>
        {(chainId != '0x10e') && 
          <Flex direction='column' align={'center'}>
            <Button mt='25px' w='114%' className="btn" bg='#347BE5' type="button" onClick={() => addLunarChain()} isLoading={loading}>Add Lunar Chain to Metamask</Button>
            <Button disabled mt='10px' w='114%' className="btn" type="button" onClick={connect} isLoading={loading}>Connect Metamask</Button>
          </Flex>
        }
        {(chainId === '0x10e') && 
          <Flex direction='column' align={'center'}>
            <Button disabled mt='25px' w='108%' className="btn" bg='#347BE5' type="button" onClick={() => addLunarChain()} isLoading={loading}>Add Lunar Chain to Metamask ✓</Button>
            <Button mt='10px' w='108%' className="btn" bg='#347BE5' type="button" onClick={connect} isLoading={loading}>Connect Metamask</Button>
          </Flex>
        }
      </Flex>
    </Flex>

  )
} else if (showSetUsernameModal && newUserStatus) {
  return (
    <SetUsernameModal />
  )
}

}
