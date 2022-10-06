// import { CeramicClient } from '@ceramicnetwork/http-client'
// import type { SupabaseClient } from '@supabase/supabase-js'

declare module '@orbisclub/orbis-sdk'

declare interface OrbisInterface {
  connect: function
  connectLit: function
  connectWithSeed: function
  createChannel: function
  createContext: function
  createConversation: function
  createGroup: function
  createPost: (options: any) => void
  createTileDocument: function
  decryptMessage: function
  decryptPost: function
  deletePost: function
  deterministicDocument: function
  editPost: function
  getChannel: function
  getConversation: function
  getConversations: function
  getDids: function
  getGroup: function
  getGroupMembers: function
  getGroups: function
  getIsFollowing: function
  getIsGroupMember: function
  getMessages: function
  getNotifications: function
  getPost: function
  getPosts: function
  getProfile: function
  getProfileFollowers: function
  getProfileFollowing: function
  getProfileGroups: function
  getProfilesByUsername: function
  isConnected: function
  logout: function
  react: function
  sendMessage: function
  setFollow: function
  setGroupMember: function
  setNotificationsReadTime: function
  testConnectSolana: function
  updateChannel: function
  updateContext: function
  updateGroup: function
  updatePost: function
  updateProfile: function
  updateTileDocument: function
}

declare interface OrbisAccountInterface {
  details: object
  did: string
  result: string
  status: number
}

declare interface OrbisPostCreatorDetailsInterface {
  a_r: number
  did: string
  metadata: {
    address: string
    chain: string
    ensName: string
  }
  nonces?: object
  profile?: OrbisCreatorProfileInterface
}

declare interface OrbisPostMentionsInterface {
  did: string
  username: string
}

interface OrbisPostContentInterface {
  body: string
  context?: string
  master?: string
  mentions?: OrbisPostMentionsInterface[]
  reply_to?: string
  type?: string
  encryptedMessage?: object
}

interface OrbisCreatorMetadataInterface {
  address?: string
  chain?: string
  ensName?: string
}

interface OrbisCreatorProfileInterface {
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

declare interface OrbisPostInterface {
  content: OrbisPostContentInterface
  context?: string
  context_details?: {
    channel_details?: {
      description: string
      group_id: string
      name: string
      type: string
    }
    channel_id?: string
    group_details?: {
      description: string
      name: string
      pfp: string
    }
    group_id?: string
  }
  count_commits?: number
  count_downvotes?: number
  count_haha?: number
  count_likes?: number
  count_replies?: number
  creator: string
  creator_details?: {
    a_r?: number
    did: string
    metadata?: OrbisCreatorMetadataInterface
    nonces?: object
    profile?: OrbisCreatorProfileInterface
  }
  group_id?: string | null
  master?: string | null
  reply_to?: string | null
  reply_to_creator_details?: {
    did: string
    metadata: OrbisCreatorMetadataInterface
    profile: OrbisCreatorProfileInterface
  }
  reply_to_details?: OrbisPostContentInterface
  stream_id: string
  timestamp: number
  type?: string
}

declare interface OrbisConversationInterface {
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
  recipients_details: OrbisPostCreatorDetailsInterface[]
  stream_id: string
}

declare interface OrbisNotificationInterface {
  content: {
    conversation_id: string
    encryptedMessage: {
      accessControlConditions: string
      encryptedString: string
      encryptedSymmetricKey: string
    }
  }
  family: string
  post_details: object
  status: string
  type: string
  user_notifying_details: {
    did: string
    profile: OrbisCreatorProfileInterface
  }
}
