import { Flex, Heading } from '@chakra-ui/react'
import { useStore } from '../store'
import { RoleGroup } from './RoleGroup'

export const OnlineUsers = () => {
  const { members } = useStore((state) => state.server)

  const users = ['admin', 'member'].map((role) => {
    const membersWithRole = members.filter((member) => member.role === role)

    return (
      <RoleGroup key={role} role={role} members={membersWithRole} />
    )
  })

  return (
    <Flex w='100%' h='100%' bg='#212225'>
      <Flex direction='column' w='100%' h='100%' mx='1.2rem'>
        {users}
      </Flex>
    </Flex>
  )
}