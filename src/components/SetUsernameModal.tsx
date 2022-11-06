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
import React, { useState } from 'react';
import { Contract, Web3Provider, Provider, Wallet } from "zksync-web3";
import { useMetaMask } from 'metamask-react'
import profileABI from '../abis/profile.json'
import cookies from '../cookies';

export const SetUsernameModal = () => {
  const showSetUsernameModal = useStore((state) => state.showSetUsernameModal)
  const setShowSetUsernameModal = useStore((state) => state.setShowSetUsernameModal)
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [message, setMessage] = React.useState('')
  const newUserStatus = useStore((state) => state.newUserStatus)
  const setNewUserStatus = useStore((state) => state.setNewUserStatus)
  const currentUser = useStore((state) => state.currentUser)
  const setCurrentUser = useStore((state) => state.setCurrentUser)
  const setContract = useStore((state) => state.setContract)
  const [OPAddressUpdated, setOPAddressUpdated] = useState(false)
  const [loading, setLoading] = useState(false)
  
    // Note that we still need to get the Metamask signer
    const signer = (new Web3Provider(ethereum)).getSigner();
    
    const contract = new Contract(
        process.env.NEXT_PUBLIC_PROFILE_CONTRACT,
        profileABI,
        signer
    );
    const provider = new Provider(process.env.NEXT_PUBLIC_Pl2);
    const operatorWallet = new Wallet(cookies.get('operatorKey'), provider);
    console.log(operatorWallet)
    const OPcontract = new Contract(
      process.env.NEXT_PUBLIC_PROFILE_CONTRACT,
      profileABI,
      operatorWallet
    );


  const checkOPAddress = async () => {
    console.log("Checking OPAddress...")
    
    const userData = await contract.getUserFromMainAddress(account) //check if user exists
    const onChainOPA = userData.operator_wallet
    console.log("Chain OPA = " + onChainOPA)
    console.log("User OPA = " + operatorWallet.address)
    if (onChainOPA != operatorWallet.address) {
      console.log("OPAddress not up to date, updating...")
      try{
        console.log(await contract.updateOperatorAddress(userData.username, operatorWallet.address))
      } catch(error){
        console.log(error)
      }
    }
  }

  const createAccount = async (username) => {
    console.log('creating account...')
    setLoading(true)
    try {
        contract.newUser({
          username: username,
          pfp_link: "https://avatars.githubusercontent.com/u/35270686?s=280&v=4",
          operator_wallet: operatorWallet.address,
          bio: "I'm a new user!",
        }).then(tx => {
          tx.wait().then(receipt => {
            console.log("New user created!")
            setCurrentUser({
              name: username,
              pfp: "https://avatars.githubusercontent.com/u/35270686?s=280&v=4",
              operatorWallet: operatorWallet.address,
              role: "member",
              bio: "I'm a new user!"
            })
            setLoading(false)
            setShowSetUsernameModal(false)
            console.log('account created!')
          })
        });
        checkIfNewUser()
    } catch (error) {
        console.log('Error creating user...');
        setLoading(false)
    }
  }


  const checkIfNewUser = async () => {
    try {
        console.log('checking if user exists...!')
        const userData = await contract.getUserFromMainAddress(account) //check if user exists
        if (userData[0] == '') {
          console.log('new user detected')
        } else {
          var adminTemp = "member"
          if (userData[5] == true) {
            adminTemp = "admin"
          }
          setCurrentUser({
            name: userData[0],
            pfp: userData[1],
            role: userData[5],
            bio: userData[6],
          })
          setNewUserStatus(false)
          setContract(OPcontract)
          if(!OPAddressUpdated){
            checkOPAddress()
          }
        }
    } catch (error) {
        console.log('Error checking user...');
  }
  }

  checkIfNewUser()

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
