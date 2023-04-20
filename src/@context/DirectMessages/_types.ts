export interface IOrbisConstructor {
  ceramic?: unknown
  node?: string
  store?: string
  PINATA_GATEWAY?: string
  PINATA_API_KEY?: string
  PINATA_SECRET_API_KEY?: string
  useLit?: boolean
}

export interface IOrbis {
  api: any
  session: any
  connect: (provider: unknown, lit?: boolean) => Promise<IOrbisConnectReturns>
  connect_v2: (opts?: {
    provider?: unknown
    chain?: string
    lit?: boolean
    oauth?: unknown
  }) => Promise<IOrbisConnectReturns>
  connectLit: (provider: unknown) => Promise<{
    status?: number
    error?: unknown
    result?: string
  }>
  connectWithSeed: (seed: Uint8Array) => Promise<IOrbisConnectReturns>
  createChannel: (
    group_id: string,
    content: Pick<IOrbisChannel, 'content'>
  ) => Promise<{
    status: number
    doc: string
    result: string
  }>
  createContext: () => void
  createConversation: (content: {
    recipients: string[]
    name?: string
    description?: string
    context?: string
  }) => Promise<{
    status: number
    doc: string
    result: string
  }>
  createGroup: (content: {
    name: string
    pfp?: string
    description?: string
  }) => Promise<{
    status: number
    doc: string
    result: string
  }>
  createPost: (content: IOrbisPostContent) => Promise<{
    status: number
    doc: string
    result: string
  }>
  createTileDocument: (
    content: unknown,
    tags: string[],
    schema: string,
    family: string
  ) => Promise<{
    status: number
    doc?: string
    error?: unknown
    result: string
  }>
  decryptMessage: (content: {
    conversation_id: string
    encryptedMessage: IOrbisEncryptedBody
  }) => Promise<{
    result: string
    status: number
  }>
  decryptPost: (content: IOrbisPostContent) => Promise<{ result: string }>
  deletePost: (stream_id: string) => Promise<{
    status: number
    result: string
  }>
  deterministicDocument: (
    content: unknown,
    tags: string[],
    schema?: string,
    family?: string
  ) => Promise<{
    status: number
    doc?: string
    error?: unknown
    result: string
  }>
  editPost: (
    stream_id: string,
    content: IOrbisPostContent,
    encryptionRules?: IOrbisEncryptionRules
  ) => Promise<{
    status: number
    result: string
  }>
  getChannel: (channel_id: string) => Promise<{
    data: IOrbisChannel
    error: unknown
    status: number
  }>
  getConversation: (conversation_id: string) => Promise<{
    status: number
    data: IOrbisConversation | null
    error: unknown
  }>
  getConversations: (opts: { did: string; context?: string }) => Promise<{
    data: IOrbisConversation[]
    error: unknown
    status: number
  }>
  getCredentials: (did: string) => Promise<{
    data: {
      stream_id: string
      family: string
      content: unknown
      issuer: string
      creator: string
      subject_id: string
      type: string
    }[]
    error: unknown
    status: number
  }>
  getDids: (address: string) => Promise<{
    data: {
      did: string
      details: Pick<IOrbisProfile, 'did' | 'details'>
      count_followers: number
      count_following: number
      pfp: string
    }[]
    error: unknown
    status: number
  }>
  getGroup: (group_id: string) => Promise<{
    data: IOrbisGroup
    error: unknown
    status: number
  }>
  getGroupMembers: (group_id: string) => Promise<{
    data: {
      active: 'true' | 'false'
      content: {
        active: boolean
        group_id: string
      }
      created_at: string
      did: string
      group_id: string
      profile_details: Pick<IOrbisProfile['details'], 'did' | 'profile'>
      stream_id: string
      timestamp: number
    }[]
    error: unknown
    status: number
  }>
  getGroups: () => Promise<{
    data: IOrbisGroup[]
    error: unknown
    status: number
  }>
  getIsFollowing: (
    did_following: string,
    did_followed: string
  ) => Promise<{
    data: boolean
    error: unknown
    status: number
  }>
  getIsGroupMember: (
    group_id: string,
    did: string
  ) => Promise<{
    data: boolean
    error: unknown
    status: number
  }>
  getMessages: (
    conversation_id: string,
    page: number
  ) => Promise<{
    data: IOrbisMessage[]
    error: unknown
    status: number
  }>
  getNotifications: (
    options: {
      context: string
      did: string
      master?: string
      only_master?: boolean
      tag?: string
      algorithm?: string
    },
    page: number
  ) => Promise<{
    data: IOrbisNotification[]
    error: unknown
    status: number
  }>
  getNotificationsCount: (options: {
    type: string
    context?: string
    conversation_id?: string
    last_read_timestamp?: number
  }) => Promise<{
    data: { count_new_notifications: number }
    error: unknown
    status: number
  }>
  getPost: (post_id: string) => Promise<{
    data: IOrbisPost
    error: unknown
    status: number
  }>
  getPosts: (
    options: {
      context?: string
      did?: string
      master?: string
      only_master?: boolean
      tag?: string
      algorithm?: keyof typeof IOrbisGetPostsAlgorithm | null
    },
    page: number
  ) => Promise<{
    data: IOrbisPost[]
    error: unknown
    status: number
  }>
  getReaction: (
    post_id: string,
    did: string
  ) => Promise<{
    data: { type: string }
    error: unknown
    status: number
  }>
  getProfile: (did: string) => Promise<{
    data: IOrbisProfile
    error: unknown
    status: number
  }>
  getProfileFollowers: (did: string) => Promise<{
    data: IOrbisProfile['details'][]
    error: unknown
    status: number
  }>
  getProfileFollowing: (did: string) => Promise<{
    data: IOrbisProfile['details'][]
    error: unknown
    status: number
  }>
  getProfileGroups: (did: string) => Promise<{
    data: {
      active: 'true' | 'false'
      content: {
        active: boolean
        group_id: string
      }
      created_at: string
      did: string
      group_details: IOrbisGroup['content']
      group_id: string
      stream_id: string
    }[]
    error: unknown
    status: number
  }>
  getProfilesByUsername: (username: string) => Promise<{
    data: IOrbisProfile[]
    error: unknown
    status: number
  }>
  isConnected: (sessionString?: string) => Promise<IOrbisConnectReturns>
  logout: () => {
    status: number
    result: string
    error: unknown
  }
  react: (
    post_id: string,
    type: string
  ) => Promise<{
    status: number
    doc: string
    result: string
  }>
  sendMessage: (content: { conversation_id: string; body: string }) => Promise<{
    status: number
    doc: string
    result: string
  }>
  setFollow: (
    did: string,
    active: boolean
  ) => Promise<{
    status: number
    doc: string
    result: string
  }>
  setGroupMember: (
    group_id: string,
    active: boolean
  ) => Promise<{
    status: number
    doc?: string
    error?: unknown
    result: string
  }>
  setNotificationsReadTime: (
    type: string,
    timestamp: number,
    context?: string
  ) => Promise<{
    status: number
    doc?: string
    error?: unknown
    result: string
  }>
  updateChannel: (
    channel_id: string,
    content: Pick<IOrbisChannel, 'content'>
  ) => Promise<{
    status: number
    doc: string
    result: string
  }>
  updateContext: () => void
  updateGroup: (
    stream_id: string,
    content: { pfp: string; name: string; description: string }
  ) => Promise<{
    status: number
    doc: string
    result: string
  }>
  updatePost: (stream_id: string, body: string) => void
  updateProfile: (content: {
    pfp: string
    cover: string
    username: string
    description: string
    pfpIsNft: {
      chain: string
      contract: string
      tokenId: string
      timestamp: string
    }
    data?: object
  }) => Promise<{
    status: number
    doc: string
    result: string
  }>
  updateTileDocument: (
    stream_id: string,
    content: unknown,
    tags: string[],
    schema: string,
    family?: string
  ) => Promise<{
    status: number
    doc?: string
    error?: unknown
    result: string
  }>
  uploadMedia: (file: File) => Promise<{
    status: number
    error?: unknown
    result: { url: string; gateway: string } | string
  }>
}

export interface IOrbisConnectReturns {
  status: number
  did: string
  details: {
    did: string
    profile: IOrbisProfile['details']['profile']
    hasLit: boolean
  }
  result: string
}

export enum IOrbisGetPostsAlgorithm {
  'recommendations',
  'all-posts',
  'all-master-posts',
  'all-did-master-posts',
  'all-context-master-posts',
  'all-posts-non-filtered',
  ''
}

export enum OrbisReaction {
  'like',
  'haha',
  'downvote'
}

export interface IOrbisGroup {
  channels: Pick<IOrbisChannel, 'content' | 'stream_id'>[]
  content: {
    name?: string
    pfp?: string
    description?: string
  }
  count_members: number
  creator: string
  last_activity_timestamp: number
  stream_id: string
}

export interface IOrbisChannel {
  archived?: boolean
  content: {
    group_id: string
    name: string
    description: string
    type: 'chat' | 'feed'
    encryptionRules?: {
      type: string
      chain: string
      contractType: 'ERC20' | 'ERC721' | 'ERC1155'
      contractAddress: string
      minTokenBalance: string
      tokenId?: string
    }
    data?: object
  }
  created_at: string
  creator: string
  group_id: string
  stream_id: string
  timestamp: number
  type: 'chat' | 'feed'
}

export interface IOrbisProfile {
  address: string
  count_followers: number
  count_following: number
  details: {
    a_r?: number
    did: string
    metadata?: {
      address?: string
      chain?: string
      ensName?: string
    }
    nonces?: number
    profile?: {
      cover?: string
      data?: object
      description?: string
      pfp?: string
      pfpIsNft?: {
        chain: string
        contract: string
        timestamp: string
        tokenId: string
      }
      username?: string
    }
    twitter_details?: {
      credential_id: string
      issuer: string
      timestamp: number
      username: string
    }
  }
  did: string
  last_activity_timestamp: number
  username: string
}

export interface IOrbisEncryptionRules {
  type: 'token-gated' | 'custom'
  chain: string
  contractType: 'ERC20' | 'ERC721' | 'ERC1155'
  contractAddress: string
  minTokenBalance: string
  tokenId: string
  accessControlConditions?: object
}

export interface IOrbisEncryptedBody {
  accessControlConditions: string
  encryptedString: string
  encryptedSymmetricKey: string
}

export interface IOrbisPostMention {
  did: string
  username: string
}

export interface IOrbisPostContent {
  body: string
  title?: string
  context?: string
  master?: string
  mentions?: IOrbisPostMention[]
  reply_to?: string
  type?: string
  tags?: {
    slug: string
    title: string
  }[]
  data?: object
  encryptionRules?: IOrbisEncryptionRules | null
  encryptedMessage?: object | null
  encryptedBody?: IOrbisEncryptedBody | null
}

export interface IOrbisPost {
  content: IOrbisPostContent
  context?: string
  context_details?: {
    channel_details?: IOrbisChannel['content']
    channel_id?: string
    group_details?: IOrbisGroup['content']
    group_id?: string
  }
  count_commits?: number
  count_downvotes?: number
  count_haha?: number
  count_likes?: number
  count_replies?: number
  creator: string
  creator_details?: IOrbisProfile['details']
  group_id?: string | null
  indexing_metadata?: {
    language?: string
    urlMetadata?: Record<string, string>
  }
  master?: string | null
  reply_to?: string | null
  reply_to_creator_details?: Pick<
    IOrbisProfile['details'],
    'did' | 'metadata' | 'profile'
  >
  reply_to_details?: IOrbisPostContent
  stream_id: string
  timestamp: number
  type?: string
}

export interface IOrbisMessageContent {
  conversation_id?: string
  encryptedMessage?: {
    accessControlConditions: string
    encryptedString: string
    encryptedSymmetricKey: string
  } | null
  encryptedMessageSolana?: {
    accessControlConditions: string
    encryptedString: string
    encryptedSymmetricKey: string
  } | null
  master?: string | null
  reply_to?: string | null
}

export interface IOrbisMessage {
  content: IOrbisMessageContent
  conversation_id: string
  created_at?: string
  creator: string
  creator_details: IOrbisProfile['details']
  master?: string | null
  recipients?: string[]
  reply_to?: string | null
  reply_to_creator_details?: Pick<
    IOrbisProfile['details'],
    'did' | 'metadata' | 'profile'
  >
  reply_to_details?: IOrbisMessageContent
  stream_id: string
  timestamp: number
}

export interface IOrbisConversation {
  content: {
    recipients: string[]
  }
  context: string | null
  details: {
    content: {
      recipients: string[]
      creator: string
    }
  }
  last_message_timestamp: number
  last_timestamp_read: number
  recipients: string[]
  recipients_details: IOrbisProfile['details'][]
  stream_id: string
}

export interface IOrbisNotification {
  content: {
    conversation_id: string
    encryptedMessage: IOrbisEncryptedBody
  }
  family: string
  post_details: object
  status: string
  type: string
  user_notifying_details: {
    did: string
    profile: IOrbisProfile['details']['profile']
  }
}

export interface IConversationWithAdditionalData extends IOrbisConversation {
  notifications_count: number
  empty_message: boolean
}

export type IOrbisProvider = {
  orbis: IOrbis
  account: IOrbisProfile
  hasLit: boolean
  openConversations: boolean
  conversationId: string
  conversations: IConversationWithAdditionalData[]
  activeConversationTitle: string
  notifsLastRead: Record<string, Record<string, number>>
  totalNotifications: number
  connectOrbis: (options: {
    address: string
    lit?: boolean
  }) => Promise<IOrbisProfile | null>
  disconnectOrbis: (address: string) => void
  checkOrbisConnection: (options: {
    address: string
    autoConnect?: boolean
    lit?: boolean
  }) => Promise<IOrbisProfile>
  connectLit: () => Promise<{
    status?: number
    error?: unknown
    result?: string
  }>
  setActiveConversationTitle: (title: string) => void
  setOpenConversations: (open: boolean) => void
  setConversationId: (conversationId: string) => void
  getConversationByDid: (userDid: string) => Promise<IOrbisConversation>
  createConversation: (recipients: string[]) => Promise<string>
  getConversationTitle: (conversationId: string) => Promise<string>
  getDid: (address: string) => Promise<string>
  clearConversationNotifs: (conversationId: string) => void
  updateConversationEmptyMessageStatus: (
    conversationId: string,
    status: boolean
  ) => void
}
