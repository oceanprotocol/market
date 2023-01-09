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

interface INewConversation {
  name: string | null
  recipients: string[]
}

type IOrbisProvider = {
  orbis: IOrbis
  account: IOrbisProfile
  hasLit: boolean
  openConversations: boolean
  conversationId: string
  conversations: IOrbisConversation[]
  notifications: Record<string, string[]>
  activeConversationTitle: string
  newConversation: INewConversation
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
  setNewConversation: (newConversation: INewConversation) => void
  setOpenConversations: (open: boolean) => void
  setConversationId: (conversationId: string) => void
  getConversation: (userDid: string) => Promise<IOrbisConversation>
  createConversation: (userDid: string) => Promise<void>
  clearMessageNotifs: (conversationId: string) => void
  getConversationTitle: (conversationId: string) => Promise<string>
  getDid: (address: string) => Promise<string>
}

const OrbisContext = createContext({} as IOrbisProvider)

const orbis: IOrbis = new Orbis()
const NOTIFICATION_REFRESH_INTERVAL = 5000
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
  const [activeConversationTitle, setActiveConversationTitle] = useState(null)
  const [newConversation, setNewConversation] =
    useState<INewConversation | null>(null)

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
      const _conversationIds = conversations.map((o) => o.stream_id)

      // Only show new notifications from existing conversations
      const _unreads = data.filter((o: IOrbisNotification) => {
        return (
          _conversationIds.includes(o.content.conversation_id) &&
          o.status === 'new'
        )
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
    const _usersNotifications = { ...usersNotifications }
    const address = didToAddress(account?.did)
    if (_usersNotifications[address]) {
      delete _usersNotifications[address][conversationId]
    }
    setUsersNotifications(_usersNotifications)
  }

  const getConversations = async (did: string = null) => {
    if (!did) return []

    const { data } = await orbis.getConversations({
      did,
      context: CONVERSATION_CONTEXT
    })

    // Only show conversations with unique recipients
    const filteredConversations: IOrbisConversation[] = []
    data.forEach((conversation: IOrbisConversation) => {
      if (conversation.recipients.length > 1) {
        // Sort recipients by alphabetical order and stringify
        const sortedRecipients = conversation.recipients.sort()
        const stringifiedRecipients = sortedRecipients.join(',')

        // Check if conversation already exists based on sorted and stringified recipients
        const found = filteredConversations.find(
          (o: IOrbisConversation) =>
            o.recipients.length > 1 &&
            o.recipients.sort().join(',') === stringifiedRecipients
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

  const getConversation = async (userDid: string) => {
    if (!account || !userDid) return null

    console.log('has account and target userDid')

    const _conversations = await getConversations(account?.did)
    if (!_conversations.length) return null

    console.log('has conversations')

    const filteredConversations = _conversations.filter(
      (conversation: IOrbisConversation) => {
        return (
          conversation.recipients.length === 2 &&
          conversation.recipients.includes(userDid)
        )
      }
    )

    if (!filteredConversations.length) return null

    console.log('has filtered conversations')

    return filteredConversations[0]
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
      if (res.status !== 200) {
        alert('Error connecting to Lit.')
        return
      }
    }

    let existingConversation = conversations.find(
      (conversation: IOrbisConversation) => {
        return conversation.recipients.includes(userDid)
      }
    )

    // Refetch to make sure we have the latest conversations
    if (!existingConversation) {
      const _conversations = await getConversations(_account?.did)
      existingConversation = _conversations.find(
        (conversation: IOrbisConversation) => {
          return conversation.recipients.includes(userDid)
        }
      )
    }

    if (existingConversation) {
      setConversationId(existingConversation.stream_id)
      setOpenConversations(true)
    } else {
      const res = await orbis.createConversation({
        recipients: [userDid],
        context: CONVERSATION_CONTEXT
      })
      if (res.status === 200) {
        setTimeout(async () => {
          const { data, error } = await orbis.getConversation(res.doc)
          if (!error && data) {
            setConversations([data, ...conversations])
          }
          setConversationId(res.doc)
          setOpenConversations(true)
        }, 2000)
      }
    }
  }

  // const createConversationV2 = async (userDid: string) => {
  //   let _account = account
  //   if (!_account) {
  //     // Check connection and force connect
  //     _account = await checkOrbisConnection({
  //       address: accountId,
  //       autoConnect: true
  //     })
  //   }

  //   if (!hasLit) {
  //     const res = await connectLit()
  //     if (res.status !== 200) {
  //       alert('Error connecting to Lit.')
  //       return
  //     }
  //   }

  //   // Refetch to make sure we have the latest conversations
  //   const _conversations = await getConversations(_account?.did)
  //   const existingConversation = _conversations.find(
  //     (conversation: IOrbisConversation) => {
  //       return conversation.recipients.includes(userDid)
  //     }
  //   )

  //   if (existingConversation) {
  //     setConversationId(existingConversation.stream_id)
  //     setOpenConversations(true)
  //   } else {
  //     const res = await orbis.createConversation({
  //       recipients: [userDid],
  //       context: CONVERSATION_CONTEXT
  //     })
  //     if (res.status === 200) {
  //       setTimeout(async () => {
  //         const { data, error } = await orbis.getConversation(res.doc)
  //         if (!error && data) {
  //           setConversations([data, ...conversations])
  //         }
  //         setConversationId(res.doc)
  //         setOpenConversations(true)
  //       }, 2000)
  //     }
  //   }
  // }

  const getConversationTitle = async (conversationId: string) => {
    if (conversationId && conversations.length) {
      // Get conversation based on conversationId
      const conversation = conversations.find(
        (o) => o.stream_id === conversationId
      )

      if (!conversation) return null

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

  useEffect(() => {
    console.log({ newConversation, activeConversationTitle })
  }, [newConversation, activeConversationTitle])

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
        activeConversationTitle,
        newConversation,
        connectOrbis,
        disconnectOrbis,
        checkOrbisConnection,
        connectLit,
        setActiveConversationTitle,
        setNewConversation,
        setOpenConversations,
        setConversationId,
        getConversation,
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
