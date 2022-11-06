export type User = {
    pfp: string;
    name: string;
    role: string;
    bio?: string;
    mainWallet?: string;
    operatorWallet?: string;
  }
  
  export type Server = {
    name: string;
    icon: string;
    banner: string;
    channels: string[];
    members: User[];
  }
  
  export type Channel = {
    name: string;
    messages: Message[];
  }

  export type Message = {
    id: string;
    content: string;
    author: User;
    timestamp: string;
    replyTo?: string;
    reactions?: Reaction[];
  }

  export type Reaction = {
    name: string;
    count: number;
  }