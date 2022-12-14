import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
  ReactElement
} from 'react'
import { useInterval } from '@hooks/useInterval'
import { Orbis } from '@orbisclub/orbis-sdk'
import { useWeb3 } from './Web3'
import { accountTruncate } from '@utils/web3'
import { didToAddress } from '@utils/orbis'
import usePrevious from '@hooks/usePrevious'
import useLocalStorage from '@hooks/useLocalStorage'

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
  const prevAccountId = usePrevious(accountId)
  const [ceramicSessions, setCeramicSessions] = useLocalStorage<string[]>(
    'ocean-ceramic-sessions',
    []
  )
  const [account, setAccount] = useState<IOrbisProfile | null>(null)
  const [hasLit, setHasLit] = useState(false)
  const [openConversations, setOpenConversations] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState<IOrbisConversation[]>([])
  const [unreadMessages, setUnreadMessages] = useState<IOrbisNotification[]>([])

  // Function to reset states
  const resetStates = () => {
    setConversationId(null)
    setConversations([])
    setUnreadMessages([])
  }

  // Connecting to Orbis
  const connectOrbis = async ({
    address,
    lit = false
  }: {
    address: string
    lit?: boolean
  }) => {
    const res = await orbis.connect_v2({
      provider: web3Provider,
      chain: 'ethereum',
      lit
    })

    if (res.status === 200) {
      const { data } = await orbis.getProfile(res.did)
      setAccount(data)
      setHasLit(res.details.hasLit)
      const sessionString = orbis.session.serialize()
      setCeramicSessions({
        ...ceramicSessions,
        [address.toLowerCase()]: sessionString
      })
      return data
    } else {
      await connectOrbis({ address })
    }
  }

  const disconnectOrbis = (address: string) => {
    const res = orbis.logout()
    if (res.status === 200) {
      setAccount(null)
      resetStates()
      const _ceramicSessions = { ...ceramicSessions }
      console.log(_ceramicSessions[address.toLowerCase()])
      delete _ceramicSessions[address.toLowerCase()]
      setCeramicSessions({ ..._ceramicSessions })
    }
  }

  const connectLit = async () => {
    const res = await orbis.connectLit(web3Provider)
    setHasLit(res.status === 200)
    return res
  }

  const checkOrbisConnection = async ({
    address,
    autoConnect,
    lit
  }: {
    address: string
    autoConnect?: boolean
    lit?: boolean
  }) => {
    const sessionString = ceramicSessions[address.toLowerCase()] || null
    const res = await orbis.isConnected(sessionString)
    if (
      res.status === 200 &&
      didToAddress(res.did) === accountId.toLowerCase()
    ) {
      setHasLit(res.details.hasLit)
      const { data } = await orbis.getProfile(res.did)
      setAccount(data)
      return data
    } else if (autoConnect) {
      const data = await connectOrbis({ address, lit })
      return data
    } else {
      resetStates()
      return null
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
      // Try to get mainnet did
      const mainnetDid = data.find(
        (o: {
          did: string
          details: Pick<IOrbisProfile, 'did' | 'details'>
        }) => {
          const did = o.did.split(':')
          return did[3] === '1'
        }
      )

      _did = mainnetDid?.did || data[0].did
    } else {
      _did = `did:pkh:eip155:1:${address.toLowerCase()}`
    }

    return _did
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
      _account = await checkOrbisConnection({
        address: accountId,
        autoConnect: true
      })
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
    let did = account?.did

    if (!did && accountId) {
      did = await getDid(accountId)
    }

    const { data, error } = await orbis.api.rpc('orbis_f_notifications', {
      user_did: did || 'none',
      notif_type: 'messages'
    })

    if (error) {
      setUnreadMessages([])
    } else if (data.length > 0) {
      // Check if did is mainnet
      const chainId = parseInt(did.split(':')[3])
      if (chainId === 0) {
        setUnreadMessages(data)
      } else {
        const _unreads = data.filter((o: IOrbisNotification) => {
          return o.status === 'new'
        })
        setUnreadMessages(_unreads)
      }
    }
  }

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

  useInterval(async () => {
    await getMessageNotifs()
  }, NOTIFICATION_REFRESH_INTERVAL)

  useEffect(() => {
    if (accountId && web3Provider) {
      // Check if wallet connected
      checkOrbisConnection({ address: accountId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, web3Provider])

  useEffect(() => {
    if (accountId !== prevAccountId) resetStates()
  }, [accountId, prevAccountId])

  useEffect(() => {
    if (account) {
      getConversations(account?.did)
    }
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
