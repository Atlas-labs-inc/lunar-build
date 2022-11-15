import create from 'zustand';
import {
  User,
  Server,
  Channel,
  Message,
} from './types';

type Store = {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentProfile: User;
  setCurrentProfile: (user: User) => void;
  server: Server;
  setServer: (server: Server) => void;
  currentChannel: Channel;
  setCurrentChannel: (channel: Channel) => void;
  showModal1: boolean;
  setShowModal1: (show: boolean) => void;
  showCreateChannel: boolean;
  setShowCreateChannel: (show: boolean) => void;
  showSetUsernameModal: boolean;
  setShowSetUsernameModal: (show: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  provider: any;
  setProvider: (provider: any) => void;
  contracts: any;
  setContracts: (contracts: any) => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  loadingMessages: boolean;
  setLoadingMessages: (loading: boolean) => void;
  replyId: string;
  setReplyId: (id: string) => void;
  newUserStatus: boolean;
  setNewUserStatus: (status: boolean) => void;
  contract: any;
  setContract: (contract: any) => void;
  OPAddress: string;
  setOPAddress: (address: string) => void;
  updateBio: (bio: string) => void;
  updatePfp: (pfp: string) => void;
  addMessage: (message: Message) => void;
  addMember: (member: User) => void;
  updateMembers: (members: User[]) => void;
  wasConnected: boolean;
  setWasConnected: (wasConnected: boolean) => void;
  signer: any;
  setSigner: (signer: any) => void;
  providerT: any;
  setProviderT: (provider: any) => void;
  operatorSigner: any;
  setOperatorSigner: (signer: any) => void;
  fundOperator: boolean;
  setFundOperator: (fundOperator: boolean) => void;
  refreshUserPanel: boolean;
  setRefreshUserPanel: (refresh: boolean) => void;
  profileContract: any;
  setProfileContract: (contract: any) => void;
  opContract: any;
  setOpContract: (contract: any) => void;
}

export const useStore = create<Store>((set) => ({
  currentUser: {
    pfp: 'https://cdn.dribbble.com/users/1176657/screenshots/15468294/media/34af996ddff444391edab94abcf3c7f3.png?compress=1&resize=400x300',
    name: null,
    role: 'member',
    bio: 'I am a full stack developer',
    mainWallet: '0x0000000000000000000000000000000000000000',
    operatorWallet: '0x0000000000000000000000000000000000000000',
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  currentProfile: {
    pfp: 'https://cdn.dribbble.com/users/1176657/screenshots/15468294/media/34af996ddff444391edab94abcf3c7f3.png?compress=1&resize=400x300',
    name: 'SameeTheDev',
    role: 'member',
    bio: 'I am a full stack developer',
    mainWallet: '0x0000000000000000000000000000000000000000',
    operatorWallet: '0x0000000000000000000000000000000000000000',
  },
  setCurrentProfile: (user) => set({ currentProfile: user }),
  server: {
    name: 'Lunar',
    icon: 'https://i.imgur.com/0y0t0y0.png',
    banner: 'https://i.imgur.com/ZYp2287.gif',
    channels: [],
    members: [],
  },
  setServer: (server) => set({ server }),
  currentChannel: {
    name: 'eth-global',
    messages: [],
  },
  updateBio: (bio) => set(state => ({ currentUser: {
    name: state.currentUser.name, 
    bio: bio,
    pfp: state.currentUser.pfp,
    role: state.currentUser.role,
  } })),
  updatePfp: (pfp) => set(state => ({ currentUser: {
    name: state.currentUser.name, 
    bio: state.currentUser.bio,
    pfp: pfp,
    role: state.currentUser.role,
  } })),
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  showModal1: true,
  setShowModal1: (showModal1) => set({ showModal1: showModal1 }),
  showCreateChannel: false,
  setShowCreateChannel: (showCreateChannel) => set({ showCreateChannel: showCreateChannel }),
  showSetUsernameModal: false,
  setShowSetUsernameModal: (showSetUsernameModal) => set({ showSetUsernameModal: showSetUsernameModal }),
  showSettingsModal: false,
  setShowSettingsModal: (showSettingsModal) => set({ showSettingsModal: showSettingsModal }),
  provider: null,
  setProvider: (provider) => set({ provider: provider }),
  contracts: {},
  setContracts: (contracts) => set({ contracts: contracts }),
  showProfileModal: false,
  setShowProfileModal: (showProfileModal) => set({ showProfileModal: showProfileModal }),
  loadingMessages: true,
  setLoadingMessages: (loadingMessages) => set({ loadingMessages: loadingMessages }),
  replyId: '0',
  setReplyId: (replyId) => set({ replyId: replyId }),
  newUserStatus: true,
  setNewUserStatus: (newUserStatus) => set({ newUserStatus: newUserStatus }),
  contract: null,
  setContract: (contract) => set({ contract: contract }),
  OPAddress: null,
  setOPAddress: (OPAddress) => set({ OPAddress: OPAddress }),
  addMessage: (message) => set((state) => ({ currentChannel: { name: state.currentChannel.name, messages: [...state.currentChannel.messages, message] } })),
  addMember: (member) => set((state) => ({ server: { name: state.server.name, icon: state.server.icon, banner: state.server.banner, channels: state.server.channels, members: [...state.server.members, member] } })),
  updateMembers: (members) => set((state) => ({ server: { name: state.server.name, icon: state.server.icon, banner: state.server.banner, channels: state.server.channels, members: members } })),
  wasConnected: false,
  setWasConnected: (wasConnected) => set({ wasConnected: wasConnected }),
  signer: null,
  setSigner: (signer) => set({ signer: signer }),
  providerT: null,
  setProviderT: (providerT) => set({ providerT: providerT }),
  operatorSigner: null,
  setOperatorSigner: (operatorSigner) => set({ operatorSigner: operatorSigner }),
  fundOperator: false,
  setFundOperator: (fundOperator) => set({ fundOperator: fundOperator }),
  refreshUserPanel: false,
  setRefreshUserPanel: (refreshUserPanel) => set({ refreshUserPanel: refreshUserPanel }),
  profileContract: null,
  setProfileContract: (profileContract) => set({ profileContract: profileContract }),
  opContract: null,
  setOpContract: (opContract) => set({ opContract: opContract }),
}));