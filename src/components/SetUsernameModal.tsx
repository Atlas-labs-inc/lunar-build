import { Flex, Heading, useDisclosure, Button,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  Text,
  Image,
  AlertDialogOverlay,
  Input,
  Spinner
} from '@chakra-ui/react'
import { useStore } from '../store'
import React, { useEffect, useState } from 'react';
import { Contract, Web3Provider, Provider, Wallet } from "zksync-web3";
import { useMetaMask } from 'metamask-react'
import profileABI from '../abis/profile.json'
import cookies from '../cookies';
import { WalletSetupModal } from './WalletSetupModal';
import { request } from 'https';

export const SetUsernameModal = () => {
  const showSetUsernameModal = useStore((state) => state.showSetUsernameModal)
  const setShowSetUsernameModal = useStore((state) => state.setShowSetUsernameModal)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [message, setMessage] = React.useState('')
  const newUserStatus = useStore((state) => state.newUserStatus)
  const setNewUserStatus = useStore((state) => state.setNewUserStatus)
  const currentUser = useStore((state) => state.currentUser)
  const setCurrentUser = useStore((state) => state.setCurrentUser)
  const [loading, setLoading] = useState(false)
  const signer = useStore((state) => state.signer)
  const [contract, setContract] = useState(null)
  const opContract = useStore((state) => state.opContract)
  const setOpContract = useStore((state) => state.setOpContract)
  const [prov, setProv] = useState(null)
  const [opWallet, setOpWallet] = useState(null)
  const [executed, setExecuted] = useState(false)
  const setFundOperator = useStore((state) => state.setFundOperator)
  const addMember = useStore((state) => state.addMember)
  const setProfileContract = useStore((state) => state.setProfileContract)
  
  // Note that we still need to get the Metamask signer
  // const signer = (new Web3Provider(ethereum)).getSigner();

  const checkOPAddress = async (contract, opWallet) => {
    console.log("Checking OPAddress...")
    
    const userData = await contract.getUserFromMainAddress(account) //check if user exists
    const onChainOPA = userData.operator_wallet
    console.log("Chain OPA = " + onChainOPA)
    console.log("User OPA = " + opWallet.address)
    if (onChainOPA != opWallet.address) {
      console.log("OPAddress not up to date, updating...")
      contract.updateOperatorAddress(userData.username, opWallet.address).then((result) => {
      setFundOperator(true)
      })

    }
  }

  const createAccount = async (username) => {
    console.log('creating account...')
    setLoading(true)
    const request = await contract.newUser({
      username: username,
      pfp_link: "https://avatars.githubusercontent.com/u/35270686?s=280&v=4",
      operator_wallet: opWallet.address,
      bio: "I'm a new user!",
    })
    request.wait().then(receipt => {
        setCurrentUser({
          name: username,
          pfp: "https://avatars.githubusercontent.com/u/35270686?s=280&v=4",
          operatorWallet: opWallet.address,
          role: "member",
          bio: "I'm a new user!"
        })

        setLoading(false)
        setShowSetUsernameModal(false)
        addMember({
          name: username,
          pfp: "https://avatars.githubusercontent.com/u/35270686?s=280&v=4",
          operatorWallet: opWallet.address,
          role: "member",
          bio: "I'm a new user!"
        })
        console.log('new account created!')
      })
  }


  const checkIfNewUser = async (contract, operatorWallet) => {
    try {
        contract.getUserFromMainAddress(account).then((userData) => {
          if (userData[0] == '') {
            console.log('new user detected')
          } else {
            console.log('user exists')
            setCurrentUser({
              name: userData[0],
              pfp: userData[1],
              role: userData[5],
              bio: userData[6],
            })
            setNewUserStatus(false)
            // setContract(OPcontract)
            checkOPAddress(contract, operatorWallet)
            setShowSetUsernameModal(false)
          }
        })
    } catch (error) {
        console.log(error);
  }
  }

  useEffect(() => {
    if (signer && !executed) {
      const c = new Contract(
        process.env.NEXT_PUBLIC_PROFILE_CONTRACT,
        profileABI,
        signer
      );
      setContract(c)
      setProfileContract(c)
      const provider = new Provider(process.env.NEXT_PUBLIC_Pl2);
      const operatorWallet = new Wallet(cookies.get('operatorKey'), provider);
      // console.log(operatorWallet)
      const op = new Contract(
        process.env.NEXT_PUBLIC_PROFILE_CONTRACT,
        profileABI,
        operatorWallet
      );
      setOpContract(op)
      setProv(provider)
      setOpWallet(operatorWallet)
      checkIfNewUser(c, operatorWallet)
      setExecuted(true)
    }
  }, [currentUser, signer])

if (showSetUsernameModal) {
  return (
    <Flex direction={'column'} zIndex={1} position={'absolute'}  w='100%' h='100%' justify={'center'}>
      <Flex position={'absolute'} w='100%' h='100%' bg='black' backdropBlur={'100%'} blur={'100%'}  opacity={'65%'}></Flex>
      <Flex zIndex={1} align={'center'}  direction='column' margin={'0 auto'} w='400px' h='310px' borderRadius={'10px'} bg='#313131'>
        <Image mt='30px' w={'55px'} src={'https://i.ibb.co/ZMqH5hJ/user.png'}></Image>
        <Heading mt='20px' color={'white'} fontWeight={'bold'} fontSize={'20px'}>Set your username</Heading>
        <Flex direction={'column'} w='60%' alignItems='left' mt='30px'>
          <Input onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              createAccount(message)
            }
          }} variant='filled' placeholder='e.g SpaceGod'></Input>
        </Flex>
        <Button mt='20px' w='60%' value={message} isLoading={loading} loadingText='Creating account...' className="btn" bg='#347BE5' type="button" onClick={() => createAccount(message)}>Continue</Button>
      </Flex>
    </Flex>

  )
}

}
