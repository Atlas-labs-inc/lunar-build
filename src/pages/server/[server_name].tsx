import { Spacer, Flex } from '@chakra-ui/react';
import { Container } from '../../components/Container';
import { UserPanel } from '../../components/UserPanel';
import { ServerInfo } from '../../components/ServerInfo';
import { User } from '../../components/User';
import { ChannelContent } from '../../components/ChannelContent';
import { WalletSetupModal } from '../../components/WalletSetupModal';
import { CreateChannelModal } from '../../components/CreateChannelModal';
import { SettingsModal } from '../../components/SettingsModal';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import { useStore } from '../../store';
import channelManagerAbi from '../../abis/channel_manager.json'
import permissionAbi from '../../abis/permission.json'
import profileAbi from '../../abis/profile.json'
import { ProfileModal } from '../../components/ProfileModal';
import { ForceDarkMode } from '../../components/ForceDarkMode'
import { MetaMaskProvider } from "metamask-react";
import { useMetaMask } from "metamask-react";

const ServerHome = () => {
  const provider = useStore((state) => state.provider);
  const setProvider = useStore((state) => state.setProvider);
  const setContracts = useStore((state) => state.setContracts);
  const setServer = useStore((state) => state.setServer);
  const setCurrentChannel = useStore((state) => state.setCurrentChannel);
  const setLoadingMessages = useStore((state) => state.setLoadingMessages);
  const currentChannel = useStore((state) => state.currentChannel);
  const server = useStore((state) => state.server);

    useEffect(() => {
      if (provider === null) {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_Pl2);
        setProvider(provider);

        const channelManager = new ethers.Contract(process.env.NEXT_PUBLIC_CHANNEL_MANAGER_CONTRACT, channelManagerAbi, provider)
        const permissions = new ethers.Contract(process.env.NEXT_PUBLIC_PERMISSION_CONTRACT, permissionAbi, provider)
        const profile = new ethers.Contract(process.env.NEXT_PUBLIC_PROFILE_CONTRACT, profileAbi, provider)

        setContracts({
          channelManager,
          permissions,
          profile
        })

        const channels = channelManager.getChannelNames()
        const members = profile.getAllUsers()
        const name = channelManager.global_channel_name()
        const icon = channelManager.icon_link()
        const banner = channelManager.banner_link()

        Promise.all([channels, members, name, icon, banner]).then((v) => {
          const serverMembers = v[1].map((member) => {
            return {
              name: member.username,
              role: member.is_moderator ? 'admin' : 'member',
              pfp: member.pfp_link,
              bio: member.bio,
              mainWallet: member.main_wallet,
              operatorWallet: member.operator_wallet
            }
          })

          setServer({
            name: v[2],
            icon: v[3],
            banner: v[4],
            channels: v[0],
            members: serverMembers
          })

          const channelName = v[0][0]
          channelManager.getMessagesPaginated(channelName, 0, 100).then((messages) => {
            const parsedMessages = messages.map((message) => {
              if (message.message === '') {
                return null
              }
              console.log(message)
              const userDetails = serverMembers.find((member) => member.name === message.username)
              return {
                id: message.id.toString(),
                content: message.message,
                author: {
                  name: message.username,
                  pfp: userDetails.pfp,
                  role: userDetails.role,
                },
                timestamp: message.timestamp.toString(),
                replyTo: message.reply_id?.toString(),
              }
            }).filter((message) => message !== null)

            console.log(parsedMessages)
            setCurrentChannel({
              name: channelName,
              messages: parsedMessages
            })

            setLoadingMessages(false)
          })
        })
      }
    }, [])

    return (
      <MetaMaskProvider>
        <ForceDarkMode>
          <Container>
            <WalletSetupModal/>
            <CreateChannelModal/>
            <SettingsModal/>
            <ProfileModal/>
            <ServerInfo />
            <ChannelContent />
            <UserPanel />
          </Container>
        </ForceDarkMode>
      </MetaMaskProvider>

    );
};

export default ServerHome;