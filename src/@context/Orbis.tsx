import React, {
  useContext,
  createContext,
  useState,
  useMemo,
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

import DirectMessages from '@shared/Orbis/DirectMessages'

type IOrbisProvider = {
  orbis: IOrbis
  account: IOrbisProfile
  hasLit: boolean
  openConversations: boolean
  conversationId: string
  conversations: IOrbisConversation[]
  conversationTitle: string
  unreadMessages: IOrbisNotification[]
  connectOrbis: (lit?: boolean) => Promise<IOrbisProfile | null>
  disconnectOrbis: () => void
  checkOrbisConnection: (options: {
    autoConnect?: boolean
    lit?: boolean
  }) => Promise<IOrbisProfile>
  connectLit: () => Promise<{
    status?: number
    error?: unknown
    result?: string
  }>
  setOpenConversations: (value: boolean) => void
  setConversationId: (value: string) => void
  createConversation: (value: string) => Promise<void>
  getDid: (value: string) => Promise<string>
}

const OrbisContext = createContext({} as IOrbisProvider)

const orbis: IOrbis = new Orbis()
const NOTIFICATION_REFRESH_INTERVAL = 10000
const CONVERSATION_CONTEXT = 'ocean_market' // Can be changed to whatever

function OrbisProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3Provider, accountId } = useWeb3()
  const [account, setAccount] = useState<IOrbisProfile | null>(null)
  const [hasLit, setHasLit] = useState(false)
  const [openConversations, setOpenConversations] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState<IOrbisConversation[]>([])
  const [unreadMessages, setUnreadMessages] = useState<IOrbisNotification[]>([])

  const conversationTitle = useMemo(() => {
    let title = null
    if (conversationId && conversations.length) {
      const conversation = conversations.find(
        (o) => o.stream_id === conversationId
      )
      if (conversation) {
        const details = conversation.recipients_details.find(
          (o: IOrbisProfile) => o.did !== account.did
        )
        const did = conversation.recipients.find(
          (o: string) => o !== account.did
        )

        const address = didToAddress(did)

        if (details) {
          title =
            details?.metadata?.ensName ||
            details?.profile?.username ||
            accountTruncate(address)
        } else {
          title = accountTruncate(address)
        }
      }
    }

    return title
  }, [conversationId, account, conversations])

  // Connecting to Orbis
  const connectOrbis = async (lit = false) => {
    const res = await orbis.connect_v2({
      provider: web3Provider,
      chain: 'ethereum',
      lit
    })

    if (res.status === 200) {
      const { data } = await orbis.getProfile(res.did)
      setAccount(data)
      setHasLit(res.details.hasLit)
      return data
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

  const checkOrbisConnection = async ({
    autoConnect,
    lit
  }: {
    autoConnect?: boolean
    lit?: boolean
  }) => {
    const res = await orbis.isConnected()
    if (res.status === 200) {
      setHasLit(res.details.hasLit)
      const { data } = await orbis.getProfile(res.did)
      setAccount(data)
      return data
    } else if (autoConnect) {
      const data = await connectOrbis(lit)
      return data
    }
    return null
  }

  const getConversations = async (did: string = null) => {
    const { data } = await orbis.getConversations({
      did,
      context: CONVERSATION_CONTEXT
    })

    // Only show conversations with exactly 2 unique participants and remove duplicates based on participants
    const filteredConversations: IOrbisConversation[] = []
    data.forEach((conversation: IOrbisConversation) => {
      if (conversation.recipients.length === 2) {
        const found = filteredConversations.find(
          (o: IOrbisConversation) =>
            o.recipients.length === 2 &&
            o.recipients.includes(conversation.recipients[0]) &&
            o.recipients.includes(conversation.recipients[1])
        )

        if (!found) {
          filteredConversations.push(conversation)
        }
      }
    })

    setConversations(filteredConversations)
    return filteredConversations
  }

  const createConversation = async (userDid: string) => {
    let _account = account
    if (!_account) {
      // Check connection and force connect
      _account = await checkOrbisConnection({ autoConnect: true })
    }

    if (!hasLit) {
      const res = await connectLit()
      if (res.status !== 200) return
    }

    let _conversations = [...conversations]
    if (!_conversations.length) {
      _conversations = await getConversations(_account?.did)
    }

    const existingConversations = _conversations.filter(
      (conversation: IOrbisConversation) => {
        return conversation.recipients.includes(userDid)
      }
    )

    if (existingConversations.length > 0) {
      setConversationId(existingConversations[0].stream_id)
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
      return
    }

    let _did: string = null

    if (data && data.length > 0) {
      _did = data[0].did
    } else {
      _did = `did:pkh:eip155:0:${address.toLowerCase()}`
    }

    return _did
  }

  useInterval(async () => {
    await getMessageNotifs()
  }, NOTIFICATION_REFRESH_INTERVAL)

  useEffect(() => {
    if (accountId && web3Provider) {
      // Check if wallet connected
      checkOrbisConnection({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, web3Provider])

  useEffect(() => {
    if (account) getConversations(account?.did)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

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
        checkOrbisConnection,
        connectLit,
        setOpenConversations,
        setConversationId,
        createConversation,
        getDid
      }}
    >
      {children}
      <DirectMessages />
    </OrbisContext.Provider>
  )
}

const useOrbis = () => {
  return useContext(OrbisContext)
}

export { OrbisProvider, useOrbis }
