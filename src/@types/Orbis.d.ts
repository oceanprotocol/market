// import { CeramicClient } from '@ceramicnetwork/http-client'
// import type { SupabaseClient } from '@supabase/supabase-js'

declare module '@orbisclub/orbis-sdk'

interface OrbisInterface {
  connect: function
  connectLit: function
  connectWithSeed: function
  createChannel: function
  createContext: function
  createConversation: function
  createGroup: function
  createPost: function
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

interface AccountInterface {
  details: object
  did: string
  result: string
  status: number
}
