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
import { useWeb3 } from '../Web3'
import { accountTruncate } from '@utils/web3'
import { didToAddress, sleep } from '@shared/DirectMessages/_utils'
import { getEnsName } from '@utils/ens'
import usePrevious from '@hooks/usePrevious'
import useLocalStorage from '@hooks/useLocalStorage'
import DirectMessages from '@shared/DirectMessages'
import {
  IOrbis,
  IOrbisProfile,
  IOrbisProvider,
  IConversationWithAdditionalData
} from './_types'
import { LoggerInstance } from '@oceanprotocol/lib'

const OrbisContext = createContext({} as IOrbisProvider)

const orbis: IOrbis = new Orbis()
const NOTIFICATION_REFRESH_INTERVAL = 5000
const CONVERSATION_CONTEXT =
  process.env.NEXT_PUBLIC_ORBIS_CONTEXT || 'ocean_market' // Can be changed to whatever

function OrbisProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3Provider, accountId } = useWeb3()
  const prevAccountId = usePrevious(accountId)

  const [ceramicSessions, setCeramicSessions] = useLocalStorage<string[]>(
    'ocean-ceramic-sessions',
    []
  )
  const [notifsLastRead, setNotifsLastRead] = useLocalStorage<
    Record<string, Record<string, number>>
  >('ocean-notifs-last-read', {})

  const [account, setAccount] = useState<IOrbisProfile | null>(null)
  const [hasLit, setHasLit] = useState(false)
  const [openConversations, setOpenConversations] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState<
    IConversationWithAdditionalData[]
  >([])
  const [activeConversationTitle, setActiveConversationTitle] = useState(null)

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

  const getConversationNotifications: (
    conversations: IConversationWithAdditionalData[]
  ) => Promise<void> = async (conversations) => {
    if (!conversations.length || !orbis) return

    let did = account?.did

    if (!did && accountId) {
      did = await getDid(accountId)
    }

    const _newConversations = await Promise.all(
      conversations.map(async (conversation) => {
        // Get timestamp of last read notification
        const lastRead =
          notifsLastRead[accountId]?.[conversation.stream_id] || 0

        const { data, error } = await orbis.api
          .rpc('orbis_f_count_notifications_alpha', {
            user_did: did,
            notif_type: 'messages',
            q_context: CONVERSATION_CONTEXT,
            q_conversation_id: conversation.stream_id,
            q_last_read: lastRead
          })
          .single()

        if (error) {
          LoggerInstance.error(`[directMessages] orbis api error: `, error)
        }

        if (data) {
          const newNotifsCount = data.count_new_notifications
          // Get conversation by stream_id
          conversation.notifications_count = newNotifsCount
        }

        const { data: _data, error: _error } = await orbis.getMessages(
          conversation.stream_id,
          0
        )

        if (_error) {
          LoggerInstance.error(
            `[directMessages] orbis getMessages sdk error: `,
            _error
          )
        }

        if (_data) {
          conversation.empty_message = _data.length === 0
        }

        return conversation
      })
    )

    setConversations(_newConversations)
  }

  const clearConversationNotifs = async (conversationId: string) => {
    if (!accountId || !conversationId) return

    const _notifsLastRead = { ...notifsLastRead }

    // Add address if not exists
    if (!_notifsLastRead[accountId]) {
      _notifsLastRead[accountId] = {}
    }

    // Add conversationId if not exists
    if (!_notifsLastRead[accountId][conversationId]) {
      _notifsLastRead[accountId][conversationId] = 0
    }

    // Update last read
    _notifsLastRead[accountId][conversationId] = Math.floor(Date.now() / 1000)
    setNotifsLastRead(_notifsLastRead)

    // Set conversation notifications count to 0
    const _conversations = conversations.map((conversation) => {
      if (conversation.stream_id === conversationId) {
        conversation.notifications_count = 0
      }
      return conversation
    })

    setConversations(_conversations)
  }

  const getConversations = async (did: string = null) => {
    if (!did) return []

    const { data } = await orbis.getConversations({
      did,
      context: CONVERSATION_CONTEXT
    })

    // Only show conversations with unique recipients
    const filteredConversations: IConversationWithAdditionalData[] = []
    data.forEach((conversation: IConversationWithAdditionalData) => {
      if (conversation.recipients.length === 2) {
        // Sort recipients by alphabetical order and stringify
        const sortedRecipients = conversation.recipients.sort()
        const stringifiedRecipients = sortedRecipients.join(',')

        // Check if conversation already exists based on sorted and stringified recipients
        const found = filteredConversations.find(
          (o: IConversationWithAdditionalData) =>
            o.recipients.length > 1 &&
            o.recipients.sort().join(',') === stringifiedRecipients
        )

        if (!found) {
          filteredConversations.push(conversation)
        }
      }
    })

    // Also fetch message notifications
    await getConversationNotifications(filteredConversations)

    setConversations(filteredConversations)
    return filteredConversations
  }

  const getConversation = async (conversationId: string) => {
    if (!conversationId) return null
    const { data, error } = await orbis.getConversation(conversationId)
    if (error || !data) {
      await sleep(2000)
      await getConversation(conversationId)
    } else {
      return data as IConversationWithAdditionalData
    }
  }

  const getConversationByDid = async (userDid: string) => {
    if (!account || !userDid) return null

    // Check from current conversations list
    if (conversations.length > 0) {
      const filteredConversations = conversations.filter(
        (conversation: IConversationWithAdditionalData) => {
          return (
            conversation.recipients.length === 2 &&
            conversation.recipients.includes(userDid)
          )
        }
      )
      if (filteredConversations.length) return filteredConversations[0]
    }

    // Refetch conversations
    const _conversations = await getConversations(account?.did)
    if (!_conversations.length) return null

    const filteredConversations = _conversations.filter(
      (conversation: IConversationWithAdditionalData) => {
        return (
          conversation.recipients.length === 2 &&
          conversation.recipients.includes(userDid)
        )
      }
    )

    if (!filteredConversations.length) return null

    return filteredConversations[0]
  }

  const createConversation = async (recipients: string[]) => {
    if (!recipients.length) return null

    const res = await orbis.createConversation({
      recipients,
      context: CONVERSATION_CONTEXT
    })

    if (res.status === 200) {
      await sleep(2000)
      const _newConversation = await getConversation(res.doc)
      if (_newConversation) {
        _newConversation.notifications_count = 0
        _newConversation.empty_message = true
        setConversations([_newConversation, ...conversations])
        return _newConversation.stream_id
      }
    }
  }

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

  const totalNotifications = useMemo(() => {
    if (!conversations.length) return 0

    // Loop through conversations and count notifications
    let count = 0
    conversations.forEach((conversation: IConversationWithAdditionalData) => {
      count += conversation?.notifications_count || 0
    })

    return count
  }, [conversations])

  const updateConversationEmptyMessageStatus = async (
    conversationId: string,
    empty: boolean
  ) => {
    if (!conversationId) return null

    const _conversations = conversations.map((conversation) => {
      if (conversation.stream_id === conversationId) {
        conversation.empty_message = empty
      }
      return conversation
    })

    setConversations(_conversations)
  }

  useInterval(async () => {
    await getConversations(account?.did)
  }, NOTIFICATION_REFRESH_INTERVAL)

  useEffect(() => {
    if (web3Provider && accountId) {
      if (accountId !== prevAccountId) {
        resetStates()
        removeLitSignature()
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
        activeConversationTitle,
        notifsLastRead,
        totalNotifications,
        connectOrbis,
        disconnectOrbis,
        checkOrbisConnection,
        connectLit,
        setActiveConversationTitle,
        setOpenConversations,
        setConversationId,
        getConversationByDid,
        createConversation,
        getConversationTitle,
        getDid,
        clearConversationNotifs,
        updateConversationEmptyMessageStatus
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
