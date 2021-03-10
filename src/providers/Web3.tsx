import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  ReactNode,
  useCallback
} from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { infuraProjectId as infuraId, portisId } from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { Logger } from '@oceanprotocol/lib'

interface Web3ProviderValue {
  web3: Web3
  web3Provider: any
  web3Modal: Web3Modal
  accountId: string
  networkId: number
  connect: () => Promise<void>
  logout: () => Promise<void>
}

const web3ModalTheme = {
  background: 'var(--background-body)',
  main: 'var(--font-color-heading)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--border-color)',
  hover: 'var(--background-highlight)'
}

// HEADS UP! We inline-require some packages so the Gatsby SSR build does not break.
// We only need them client-side.
const providerOptions =
  typeof window !== 'undefined'
    ? {
        walletconnect: {
          package: WalletConnectProvider,
          options: { infuraId }
        },
        portis: {
          package: require('@portis/web3'),
          options: {
            id: portisId
          }
        }
        // torus: {
        //   package: require('@toruslabs/torus-embed')
        //   // options: {
        //   //   networkParams: {
        //   //     host: oceanConfig.url, // optional
        //   //     chainId: 1337, // optional
        //   //     networkId: 1337 // optional
        //   //   }
        //   // }
        // }
      }
    : {}

export const web3ModalOpts = {
  cacheProvider: true,
  providerOptions,
  theme: web3ModalTheme
}

const Web3Context = createContext({} as Web3ProviderValue)

function OceanProvider({ children }: { children: ReactNode }): ReactElement {
  const [web3, setWeb3] = useState<Web3>()
  const [web3Provider, setWeb3Provider] = useState<any>()
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [networkId, setNetworkId] = useState<number>()
  const [accountId, setAccountId] = useState<string>()

  const connect = useCallback(async () => {
    if (!web3Modal) return

    try {
      Logger.log('Connecting Web3...')

      const provider = await web3Modal?.connect()
      setWeb3Provider(provider)

      const web3 = new Web3(provider)
      setWeb3(web3)
      Logger.log('Web3 created.', web3)

      const networkId = await web3.eth.net.getId()
      setNetworkId(networkId)
      Logger.log('network id ', networkId)

      const accountId = (await web3.eth.getAccounts())[0]
      setAccountId(accountId)
      Logger.log('account id', accountId)
    } catch (error) {
      Logger.error(error)
    }
  }, [web3Modal])

  // -----------------------------------
  // Create iniital Web3Modal instance,
  // and reconnect automatically for returning users
  // -----------------------------------
  useEffect(() => {
    async function init() {
      if (web3Modal) return

      const web3ModalInstance = new Web3Modal(web3ModalOpts)
      setWeb3Modal(web3ModalInstance)
      Logger.log('Web3Modal instance created.', web3ModalInstance)
    }
    init()

    web3Modal?.cachedProvider && connect()
  }, [connect, web3Modal])

  async function logout() {
    web3Modal?.clearCachedProvider()
  }

  // -----------------------------------
  // Handle change events
  // -----------------------------------
  async function handleNetworkChanged(chainId: string) {
    Logger.log('Network changed', chainId)
    setNetworkId(Number(chainId.replace('0x', '')))
  }

  async function handleAccountsChanged(accounts: string[]) {
    Logger.log('Account changed', accounts[0])
    setAccountId(accounts[0])
  }

  useEffect(() => {
    if (!web3Provider || !web3) return

    web3Provider.on('chainChanged', handleNetworkChanged)
    web3Provider.on('accountsChanged', handleAccountsChanged)

    return () => {
      web3Provider.removeListener('chainChanged')
      web3Provider.removeListener('accountsChanged')
    }
  }, [web3Provider, web3])

  return (
    <Web3Context.Provider
      value={{
        web3,
        web3Provider,
        web3Modal,
        accountId,
        networkId,
        connect,
        logout
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

// Helper hook to access the provider values
const useWeb3 = (): Web3ProviderValue => useContext(Web3Context)

export { OceanProvider, useWeb3, Web3ProviderValue, Web3Context }
export default OceanProvider
