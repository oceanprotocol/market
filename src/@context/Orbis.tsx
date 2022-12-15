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
import { getEnsName } from '@utils/ens'
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
  notifications: Record<string, string[]>
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
  clearMessageNotifs: (conversationId: string) => void
  getConversationTitle: (conversationId: string) => Promise<string>
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
  const [usersNotifications, setUsersNotifications] = useLocalStorage<
    Record<string, Record<string, string[]>>
  >('ocean-convo-notifs', {})

  const [account, setAccount] = useState<IOrbisProfile | null>(null)
  const [hasLit, setHasLit] = useState(false)
  const [openConversations, setOpenConversations] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState<IOrbisConversation[]>([])

  // Function to reset states
  const resetStates = () => {
    setAccount(null)
    setConversationId(null)
    setConversations([])
    setHasLit(false)
  }

  // Remove ceramic session
  const removeCeramicSession = (address: string) => {
    const _ceramicSessions = { ...ceramicSessions }
    delete _ceramicSessions[address.toLowerCase()]
    setCeramicSessions({ ..._ceramicSessions })
  }

  // Remove lit signature
  const removeLitSignature = () => {
    window.localStorage.removeItem('lit-auth-signature')
    window.localStorage.removeItem('lit-auth-sol-signature')
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
      console.log('disconnected')
      resetStates()
      removeLitSignature()
      removeCeramicSession(address)
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
    const sessionString = ceramicSessions[address.toLowerCase()] || '-'
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
      console.log('not connected')
      resetStates()
      removeLitSignature()
      removeCeramicSession(address)
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

  const getMessageNotifs = async () => {
    let did = account?.did

    if (!did && accountId) {
      did = await getDid(accountId)
    }

    const address = didToAddress(did)

    const { data, error } = await orbis.api.rpc('orbis_f_notifications', {
      user_did: did || 'none',
      notif_type: 'messages'
    })

    if (!error && data.length > 0) {
      const _usersNotifications = { ...usersNotifications }
      const _unreads = data.filter((o: IOrbisNotification) => {
        return o.status === 'new'
      })
      _unreads.forEach((o: IOrbisNotification) => {
        const conversationId = o.content.conversation_id
        const { encryptedString } = o.content.encryptedMessage

        // Add address if not exists
        if (!_usersNotifications[address]) _usersNotifications[address] = {}

        // Add conversationId if not exists
        if (!_usersNotifications[address][conversationId])
          _usersNotifications[address][conversationId] = []

        // Add encryptedString if not exists
        if (
          !_usersNotifications[address][conversationId].includes(
            encryptedString
          )
        ) {
          _usersNotifications[address][conversationId].push(encryptedString)
        }
      })
      setUsersNotifications(_usersNotifications)

      if (_unreads.length > 0) {
        // Get unix timestamp in seconds
        const timestamp = Math.floor(Date.now() / 1000)
        // Set read time
        await orbis.setNotificationsReadTime('messages', timestamp)
      }
    }
  }

  const clearMessageNotifs = (conversationId: string) => {
    console.log('clearMessageNotifs', conversationId)
    const _usersNotifications = { ...usersNotifications }
    const address = didToAddress(account?.did)
    if (_usersNotifications[address]) {
      delete _usersNotifications[address][conversationId]
    }
    setUsersNotifications(_usersNotifications)
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

    // Also fetch message notifications
    await getMessageNotifs()

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

  const getConversationTitle = async (conversationId: string) => {
    if (conversationId && conversations.length) {
      // Get conversation based on conversationId
      const conversation = conversations.find(
        (o) => o.stream_id === conversationId
      )

      // Get address from did
      const did = conversation.recipients.find((o: string) => o !== account.did)
      const address = didToAddress(did)

      // Get ens name if exists
      const ensName = await getEnsName(address)

      return ensName || accountTruncate(address)
    } else {
      return null
    }
  }

  const notifications = useMemo(() => {
    let _notifications = {}
    if (accountId && accountId.toLowerCase() in usersNotifications) {
      _notifications = usersNotifications[accountId.toLowerCase()]
    }
    return _notifications
  }, [accountId, usersNotifications])

  useInterval(async () => {
    await getConversations(account?.did)
  }, NOTIFICATION_REFRESH_INTERVAL)

  useEffect(() => {
    if (web3Provider && accountId) {
      if (accountId !== prevAccountId) {
        resetStates()
      }
      // Check if wallet connected
      checkOrbisConnection({ address: accountId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, prevAccountId, web3Provider])

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
        notifications,
        connectOrbis,
        disconnectOrbis,
        checkOrbisConnection,
        connectLit,
        setOpenConversations,
        setConversationId,
        createConversation,
        clearMessageNotifs,
        getConversationTitle,
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
