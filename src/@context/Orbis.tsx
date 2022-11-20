import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement
} from 'react'
import { sleep } from '@utils/index'
import { useInterval } from '@hooks/useInterval'
import { Orbis } from '@orbisclub/orbis-sdk'
import { useWeb3 } from './Web3'
import { accountTruncate } from '@utils/web3'
import { didToAddress } from '@utils/orbis'

type IOrbisProvider = {
  orbis: IOrbis
  account: IOrbisProfile
  hasLit: boolean
  openConversations: boolean
  conversationId: string
  conversations: IOrbisConversation[]
  conversationTitle: string
  unreadMessages: IOrbisNotification[]
  connectOrbis: () => Promise<void>
  disconnectOrbis: () => void
  checkConnection: (value: boolean) => Promise<void>
  connectLit: () => Promise<{
    status?: number
    error?: any
    result?: string
  }>
  setOpenConversations: (value: boolean) => void
  setConversationId: (value: string) => void
  setConversations: (value: IOrbisConversation[]) => void
  getConversations: () => Promise<void>
  createConversation: (value: string) => Promise<void>
  checkConversation: (value: string) => IOrbisConversation[]
  getDid: (value: string) => Promise<string>
}

const OrbisContext = createContext({} as IOrbisProvider)

const orbis: IOrbis = new Orbis()
const NOTIFICATION_REFRESH_INTERVAL = 10000
const CONVERSATION_CONTEXT = 'ocean_market'

function OrbisProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3Provider } = useWeb3()
  const [account, setAccount] = useState<IOrbisProfile | null>(null)
  const [hasLit, setHasLit] = useState(false)
  const [openConversations, setOpenConversations] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [conversationTitle, setConversationTitle] = useState(null)
  const [unreadMessages, setUnreadMessages] = useState<IOrbisNotification[]>([])

  // Connecting to Orbis
  const connectOrbis = async () => {
    const res = await orbis.connect_v2({
      provider: web3Provider,
      chain: 'ethereum'
    })
    if (res.status === 200) {
      const { data } = await orbis.getProfile(res.did)
      setAccount(data)
    } else {
      await sleep(2000)
      await connectOrbis()
    }
  }

  const disconnectOrbis = () => {
    const res = orbis.logout()
    if (res.status === 200) {
      setAccount(null)
    }
  }

  const connectLit = async () => {
    const res = await orbis.connectLit(web3Provider)
    setHasLit(res.status === 200)
    return res
  }

  const checkConnection = async (autoConnect = true) => {
    const res = await orbis.isConnected()

    if (res.status === 200) {
      setHasLit(res.details.hasLit)
      const { data } = await orbis.getProfile(res.did)
      setAccount(data)
    } else if (autoConnect) {
      await connectOrbis()
    }
  }

  const getConversations = async () => {
    const { data, error } = await orbis.getConversations({
      did: account?.did,
      context: CONVERSATION_CONTEXT
    })

    if (error) {
      console.log(error)
    }

    if (data) {
      setConversations(data)
    }
  }

  const checkConversation = (userDid: string) => {
    const filtered: IOrbisConversation[] = conversations.filter(
      (conversation: IOrbisConversation) => {
        return conversation.recipients.includes(userDid)
      }
    )

    return filtered
  }

  const createConversation = async (userDid: string) => {
    if (!hasLit) {
      const res = await connectLit()
      if (res.status !== 200) return
    }

    const convoExists = checkConversation(userDid)

    if (convoExists.length > 0) {
      setConversationId(convoExists[0].stream_id)
      setOpenConversations(true)
    } else {
      const res = await orbis.createConversation({
        recipients: [userDid],
        context: CONVERSATION_CONTEXT
      })
      if (res.status === 200) {
        setConversationId(res.doc)
        setOpenConversations(true)
      }
    }
  }

  const getMessageNotifs = async () => {
    const { data, error } = await orbis.api.rpc('orbis_f_notifications', {
      user_did: account?.did || 'none',
      notif_type: 'messages'
    })

    if (error) {
      console.log(error)
      setUnreadMessages([])
    } else if (data.length > 0) {
      const _unreads = data.filter((o: IOrbisNotification) => {
        return o.status === 'new'
      })
      setUnreadMessages(_unreads)
    }
  }

  const getDid = async (address: string) => {
    if (!address) return null

    const { data, error } = await orbis.getDids(address)

    if (error) {
      console.log(error)
      return
    }

    let _did: string = null

    if (data && data.length > 0) {
      _did = data[0].did
    }

    return _did
  }

  useInterval(async () => {
    await getMessageNotifs()
  }, NOTIFICATION_REFRESH_INTERVAL)

  useEffect(() => {
    if (account) {
      // Fetch conversations
      getConversations()
    } else if (web3Provider) {
      // Check if wallet connected
      checkConnection()
    }
  }, [account, web3Provider])

  useEffect(() => {
    if (conversationId && conversations.length) {
      const conversation = conversations.find(
        (o) => o.stream_id === conversationId
      )
      if (conversation) {
        const recipient = conversation.recipients_details.find(
          (o: IOrbisProfile) => o.did !== account.did
        )

        const address =
          recipient?.metadata?.address || didToAddress(recipient?.did)

        setConversationTitle(
          recipient?.metadata?.ensName ||
            recipient?.profile?.username ||
            accountTruncate(address)
        )
      }
    } else {
      setConversationTitle(null)
    }
  }, [conversationId, account, conversations])

  return (
    <OrbisContext.Provider
      value={{
        orbis,
        account,
        hasLit,
        openConversations,
        conversationId,
        conversations,
        conversationTitle,
        unreadMessages,
        connectOrbis,
        disconnectOrbis,
        checkConnection,
        connectLit,
        setOpenConversations,
        setConversationId,
        setConversations,
        getConversations,
        createConversation,
        checkConversation,
        getDid
      }}
    >
      {children}
    </OrbisContext.Provider>
  )
}

const useOrbis = () => {
  return useContext(OrbisContext)
}

export { OrbisProvider, useOrbis }
