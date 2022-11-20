declare module '@orbisclub/orbis-sdk'

declare interface IOrbisConstructor {
  ceramic?: any
  node?: any
  store?: string
  PINATA_GATEWAY?: string
  PINATA_API_KEY?: string
  PINATA_SECRET_API_KEY?: string
  useLit?: boolean
}

declare interface IOrbis {
  api: any
  connect: (provider: any, lit?: boolean) => Promise<IOrbisConnectReturns>
  connect_v2: (opts?: {
    provider?: any
    chain?: string
    lit?: boolean
    oauth?: any
  }) => Promise<IOrbisConnectReturns>
  connectLit: (provider: any) => Promise<{
    status?: number
    error?: any
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
    content: any,
    tags: string[],
    schema: string,
    family: string
  ) => Promise<{
    status: number
    doc?: string
    error?: any
    result: string
  }>
  decryptMessage: (content: {
    conversation_id: string
    encryptedMessage: IOrbisEncryptedBody
  }) => Promise<any>
  decryptPost: (content: IOrbisPostContent) => Promise<any>
  deletePost: (stream_id: string) => Promise<{
    status: number
    result: string
  }>
  deterministicDocument: (
    content: any,
    tags: string[],
    schema?: string,
    family?: string
  ) => Promise<{
    status: number
    doc?: string
    error?: any
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
    error: any
    status: number
  }>
  getConversation: (conversation_id: string) => Promise<{
    status: number
    data: any
    error: any
  }>
  getConversations: (opts: { did: string; context?: string }) => Promise<any>
  getDids: (address: string) => Promise<{
    data: any
    error: any
    status: number
  }>
  getGroup: (group_id: string) => Promise<{
    data: IOrbisGroup
    error: any
    status: any
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
    error: any
    status: number
  }>
  getGroups: () => Promise<{
    data: IOrbisGroup[]
    error: any
    status: number
  }>
  getIsFollowing: (
    did_following: string,
    did_followed: string
  ) => Promise<{
    data: boolean
    error: any
    status: number
  }>
  getIsGroupMember: (
    group_id: string,
    did: string
  ) => Promise<{
    data: boolean
    error: any
    status: number
  }>
  getMessages: (
    conversation_id: string,
    page: number
  ) => Promise<{
    data: IOrbisMessage[]
    error: any
    status: number
  }>
  getNotifications: (options: { type: string; context?: string }) => Promise<{
    data: any
    error: any
    status: number
  }>
  getPost: (post_id: string) => Promise<{
    data: IOrbisPost
    error: any
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
    error: any
    status: number
  }>
  getReaction: (
    post_id: string,
    did: string
  ) => Promise<{
    data: { type: string }
    error: any
    status: number
  }>
  getProfile: (did: string) => Promise<{
    data: IOrbisProfile
    error: any
    status: number
  }>
  getProfileFollowers: (did: string) => Promise<{
    data: IOrbisProfile['details'][]
    error: any
    status: number
  }>
  getProfileFollowing: (did: string) => Promise<{
    data: IOrbisProfile['details'][]
    error: any
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
    error: any
    status: number
  }>
  getProfilesByUsername: (username: string) => Promise<{
    data: IOrbisProfile[]
    error: any
    status: number
  }>
  isConnected: (sessionString?: string) => Promise<IOrbisConnectReturns>
  logout: () => {
    status: number
    result: string
    error: any
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
    error?: any
    result: string
  }>
  setNotificationsReadTime: (
    type: string,
    timestamp: number,
    context?: string
  ) => Promise<{
    status: number
    doc?: string
    error?: any
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
    content: any,
    tags: string[],
    schema: string,
    family?: string
  ) => Promise<{
    status: number
    doc?: string
    error?: any
    result: string
  }>
  uploadMedia: (file: File) => Promise<{
    status: number
    error?: any
    result: any
  }>
}

interface IOrbisConnectReturns {
  status: number
  did: string
  details: any
  result: string
}

declare enum IOrbisGetPostsAlgorithm {
  'recommendations',
  'all-posts',
  'all-master-posts',
  'all-did-master-posts',
  'all-context-master-posts',
  'all-posts-non-filtered',
  ''
}

declare enum OrbisReaction {
  'like',
  'haha',
  'downvote'
}

interface IOrbisGroup {
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

interface IOrbisChannel {
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

declare interface IOrbisProfile {
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
    nonces?: any
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
    twitter_details?: any
  }
  did: string
  last_activity_timestamp: number
  username: string
}

interface IOrbisEncryptionRules {
  type: 'token-gated' | 'custom'
  chain: string
  contractType: 'ERC20' | 'ERC721' | 'ERC1155'
  contractAddress: string
  minTokenBalance: string
  tokenId: string
  accessControlConditions?: object
}

interface IOrbisEncryptedBody {
  accessControlConditions: string
  encryptedString: string
  encryptedSymmetricKey: string
}

interface IOrbisPostMention {
  did: string
  username: string
}

interface IOrbisPostContent {
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

declare interface IOrbisPost {
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

declare interface IOrbisMessageContent {
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

declare interface IOrbisMessage {
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

declare interface IOrbisConversation {
  content: {
    recipients: string[]
  }
  context?: string | null
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

declare interface IOrbisNotification {
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
