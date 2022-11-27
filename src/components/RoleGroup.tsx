import {
    Flex,
    Text,
    Avatar,
    Button
  } from '@chakra-ui/react'
  import { useStore } from '../store'
  import { User } from '../types'
  
  interface RoleGroupProps {
    role: string
    members: User[]
  }
  
  export const RoleGroup = ({ role, members }: RoleGroupProps) => {
    const setShowProfileModal = useStore((state) => state.setShowProfileModal)
    const setCurrentProfile = useStore((state) => state.setCurrentProfile)

    const users = members.map((member) => {
      return (
        <Button onClick={() => {
          setCurrentProfile(member);
          setShowProfileModal(true);
        }
          } bg='transparent' h='50px' justifyContent={'left'} key={member.name} my='.1rem'>
          <Avatar w={'35px'} h={'35px'} src={member.pfp} />
          <Text fontSize={'13px'} ml='10px' color={role === 'admin' ? '#347BE5' : '#fff'} size='1.1rem' as='b'>{member.name}</Text>
        </Button>
      )
    })
  
    return (
      <Flex w='100%'>
        <Flex direction='column' w='100%'>
          <Text fontSize={'12px'} color='#8E9297' as='b'>{role.toUpperCase() + ' - ' + members.length}</Text>
          {users}
        </Flex>
      </Flex>
    )
  }