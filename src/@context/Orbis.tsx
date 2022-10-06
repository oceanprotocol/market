import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement
} from 'react'
import { sleep } from '@utils/index'
import { Orbis } from '@orbisclub/orbis-sdk'
import { accountTruncate } from '@utils/web3'
import { didToAddress } from '@utils/orbis'
import { useWeb3 } from './Web3'

const OrbisContext = createContext(null)

function OrbisProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3Provider } = useWeb3()
  const [orbis, setOrbis] = useState<OrbisInterface>()
  const [account, setAccount] = useState<OrbisAccountInterface>()
  const [convOpen, setConvOpen] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [conversationTitle, setConversationTitle] = useState(null)

  // Connecting to Orbis
  const connectOrbis = async (provider: object): Promise<void> => {
    if (!orbis) return

    const res = await orbis.connect(provider)
    if (res.status !== 200) {
      await sleep(2000)
      connectOrbis(provider)
    } else {
      setAccount(res)
    }
  }

  const checkConnection = async (): Promise<void> => {
    const res = await orbis.isConnected()

    if (res.status === 200) {
      setAccount(res)
    } else {
      connectOrbis(web3Provider)
    }
  }

  // Init Orbis
  useEffect(() => {
    const _orbis = new Orbis()
    setOrbis(_orbis)
  }, [])

  const getConversations = async () => {
    const { data, error } = await orbis.getConversations({
      did: account?.did,
      context: 'ocean_market'
    })

    if (data) {
      console.log(data)
      setConversations(data)
    }
    if (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Check if wallet connected
    if (!account && orbis && web3Provider) {
      checkConnection()
    }

    // Fetch conversations
    if (account && orbis) {
      getConversations()
    }
  }, [account, orbis, web3Provider])

  useEffect(() => {
    if (conversationId && conversations.length) {
      const conversation = conversations.find(
        (o) => o.stream_id === conversationId
      )
      if (conversation) {
        const recipient = conversation.recipients_details.find(
          (o: any) => o.did !== account.did
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
        connectOrbis,
        setConvOpen,
        convOpen,
        conversationId,
        setConversationId,
        conversations,
        setConversations,
        getConversations,
        conversationTitle
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
