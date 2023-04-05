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
import Web3Modal, { getProviderInfo, IProviderInfo } from 'web3modal'
import { infuraProjectId as infuraId } from '../../app.config'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { LoggerInstance } from '@oceanprotocol/lib'
import { isBrowser } from '@utils/index'
import { getEnsProfile } from '@utils/ens'
import useNetworkMetadata, {
  getNetworkDataById,
  getNetworkDisplayName,
  getNetworkType,
  NetworkType
} from '../@hooks/useNetworkMetadata'
import { useMarketMetadata } from './MarketMetadata'
import { getTokenBalance } from '@utils/web3'
import { getOpcsApprovedTokens } from '@utils/subgraph'

interface Web3ProviderValue {
  web3: Web3
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  web3Provider: any
  web3Modal: Web3Modal
  web3ProviderInfo: IProviderInfo
  accountId: string
  accountEns: string
  accountEnsAvatar: string
  balance: UserBalance
  networkId: number
  chainId: number
  networkDisplayName: string
  networkData: EthereumListsChain
  block: number
  isTestnet: boolean
  web3Loading: boolean
  isSupportedOceanNetwork: boolean
  approvedBaseTokens: TokenInfo[]
  connect: () => Promise<string>
  logout: () => Promise<void>
}

const web3ModalTheme = {
  background: 'var(--background-body)',
  main: 'var(--font-color-heading)',
  secondary: 'var(--brand-grey-light)',
  border: 'var(--border-color)',
  hover: 'var(--background-highlight)'
}

const providerOptions = isBrowser
  ? {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
          rpc: {
            137: 'https://polygon-rpc.com',
            80001: 'https://rpc-mumbai.matic.today'
          }
        }
      }
    }
  : {}

export const web3ModalOpts = {
  cacheProvider: true,
  providerOptions,
  theme: web3ModalTheme
}

const refreshInterval = 20000 // 20 sec.

const Web3Context = createContext({} as Web3ProviderValue)

function Web3Provider({ children }: { children: ReactNode }): ReactElement {
  const { networksList } = useNetworkMetadata()
  const { appConfig } = useMarketMetadata()

  const [web3, setWeb3] = useState<Web3>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [web3Provider, setWeb3Provider] = useState<any>()

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [web3ProviderInfo, setWeb3ProviderInfo] = useState<IProviderInfo>()
  const [networkId, setNetworkId] = useState<number>()
  const [chainId, setChainId] = useState<number>()
  const [networkDisplayName, setNetworkDisplayName] = useState<string>()
  const [networkData, setNetworkData] = useState<EthereumListsChain>()
  const [block, setBlock] = useState<number>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [accountId, setAccountId] = useState<string>()
  const [accountEns, setAccountEns] = useState<string>()
  const [accountEnsAvatar, setAccountEnsAvatar] = useState<string>()
  const [web3Loading, setWeb3Loading] = useState<boolean>(true)
  const [balance, setBalance] = useState<UserBalance>({
    eth: '0'
  })
  const [isSupportedOceanNetwork, setIsSupportedOceanNetwork] = useState(true)
  const [approvedBaseTokens, setApprovedBaseTokens] = useState<TokenInfo[]>()

  // -----------------------------------
  // Helper: connect to web3
  // -----------------------------------
  const connect = useCallback(async () => {
    if (!web3Modal) {
      setWeb3Loading(false)
      return
    }
    try {
      setWeb3Loading(true)
      LoggerInstance.log('[web3] Connecting Web3...')

      const provider = await web3Modal?.connect()
      setWeb3Provider(provider)

      const web3 = new Web3(provider)
      setWeb3(web3)
      LoggerInstance.log('[web3] Web3 created.', web3)

      const networkId = await web3.eth.net.getId()
      setNetworkId(networkId)
      LoggerInstance.log('[web3] network id ', networkId)

      const chainId = await web3.eth.getChainId()
      setChainId(chainId)
      LoggerInstance.log('[web3] chain id ', chainId)

      const accountId = (await web3.eth.getAccounts())[0]
      setAccountId(accountId)
      LoggerInstance.log('[web3] account id', accountId)
      return accountId
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message)
      return null
    } finally {
      setWeb3Loading(false)
    }
  }, [web3Modal])

  // -----------------------------------
  // Helper: Get approved base tokens list
  // -----------------------------------
  const getApprovedBaseTokens = useCallback(async (chainId: number) => {
    try {
      const approvedTokensList = await getOpcsApprovedTokens(chainId)
      setApprovedBaseTokens(approvedTokensList)
      LoggerInstance.log('[web3] Approved baseTokens', approvedTokensList)
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message)
    }
  }, [])

  // -----------------------------------
  // Helper: Get user balance
  // -----------------------------------
  const getUserBalance = useCallback(async () => {
    if (!accountId || !networkId || !web3 || !networkData) return

    try {
      const userBalance = web3.utils.fromWei(
        await web3.eth.getBalance(accountId, 'latest')
      )
      const key = networkData.nativeCurrency.symbol.toLowerCase()
      const balance: UserBalance = { [key]: userBalance }

      if (approvedBaseTokens?.length > 0) {
        await Promise.all(
          approvedBaseTokens.map(async (token) => {
            const { address, decimals, symbol } = token
            const tokenBalance = await getTokenBalance(
              accountId,
              decimals,
              address,
              web3
            )
            balance[symbol.toLocaleLowerCase()] = tokenBalance
          })
        )
      }

      setBalance(balance)
      LoggerInstance.log('[web3] Balance: ', balance)
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message)
    }
  }, [accountId, approvedBaseTokens, networkId, web3, networkData])

  // -----------------------------------
  // Helper: Get user ENS info
  // -----------------------------------
  const getUserEns = useCallback(async () => {
    if (!accountId) return

    try {
      const profile = await getEnsProfile(accountId)

      if (!profile) {
        setAccountEns(null)
        setAccountEnsAvatar(null)
        return
      }

      setAccountEns(profile.name)
      LoggerInstance.log(
        `[web3] ENS name found for ${accountId}:`,
        profile.name
      )

      if (profile.avatar) {
        setAccountEnsAvatar(profile.avatar)
        LoggerInstance.log(
          `[web3] ENS avatar found for ${accountId}:`,
          profile.avatar
        )
      } else {
        setAccountEnsAvatar(null)
      }
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message)
    }
  }, [accountId])

  // -----------------------------------
  // Create initial Web3Modal instance
  // -----------------------------------
  useEffect(() => {
    if (web3Modal) {
      setWeb3Loading(false)
      return
    }

    async function init() {
      // note: needs artificial await here so the log message is reached and output
      const web3ModalInstance = await new Web3Modal(web3ModalOpts)
      setWeb3Modal(web3ModalInstance)
      LoggerInstance.log(
        '[web3] Web3Modal instance created.',
        web3ModalInstance
      )
    }
    init()
  }, [connect, web3Modal])

  // -----------------------------------
  // Reconnect automatically for returning users
  // -----------------------------------
  useEffect(() => {
    if (!web3Modal?.cachedProvider) return

    async function connectCached() {
      LoggerInstance.log(
        '[web3] Connecting to cached provider: ',
        web3Modal.cachedProvider
      )
      await connect()
    }
    connectCached()
  }, [connect, web3Modal])

  // -----------------------------------
  // Get and set approved base tokens list
  // -----------------------------------
  useEffect(() => {
    if (web3Loading) return
    getApprovedBaseTokens(chainId || 1)
  }, [chainId, getApprovedBaseTokens, web3Loading])

  // -----------------------------------
  // Get and set user balance
  // -----------------------------------
  useEffect(() => {
    getUserBalance()

    // init periodic refresh of wallet balance
    const balanceInterval = setInterval(() => getUserBalance(), refreshInterval)

    return () => {
      clearInterval(balanceInterval)
    }
  }, [getUserBalance])

  // -----------------------------------
  // Get and set user ENS info
  // -----------------------------------
  useEffect(() => {
    getUserEns()
  }, [getUserEns])

  // -----------------------------------
  // Get and set network metadata
  // -----------------------------------
  useEffect(() => {
    if (!networkId) return
    const networkData = getNetworkDataById(networksList, networkId)
    setNetworkData(networkData)
    LoggerInstance.log(
      networkData
        ? `[web3] Network metadata found.`
        : `[web3] No network metadata found.`,
      networkData
    )

    // Construct network display name
    const networkDisplayName = getNetworkDisplayName(networkData)
    setNetworkDisplayName(networkDisplayName)

    setIsTestnet(getNetworkType(networkData) !== NetworkType.Mainnet)

    LoggerInstance.log(
      `[web3] Network display name set to: ${networkDisplayName}`
    )
  }, [networkId, networksList])

  // -----------------------------------
  // Get and set latest head block
  // -----------------------------------
  useEffect(() => {
    if (!web3) return

    async function getBlock() {
      const block = await web3.eth.getBlockNumber()
      setBlock(block)
      LoggerInstance.log('[web3] Head block: ', block)
    }
    getBlock()
  }, [web3, networkId])

  // -----------------------------------
  // Get and set web3 provider info
  // -----------------------------------
  // Workaround cause getInjectedProviderName() always returns `MetaMask`
  // https://github.com/oceanprotocol/market/issues/332
  useEffect(() => {
    if (!web3Provider) return

    const providerInfo = getProviderInfo(web3Provider)
    setWeb3ProviderInfo(providerInfo)
  }, [web3Provider])

  // -----------------------------------
  // Logout helper
  // -----------------------------------
  async function logout() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if ((web3?.currentProvider as any)?.close) {
      await (web3.currentProvider as any).close()
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    await web3Modal.clearCachedProvider()
  }
  // -----------------------------------
  // Get valid Networks and set isSupportedOceanNetwork
  // -----------------------------------

  useEffect(() => {
    if (appConfig.chainIdsSupported.includes(networkId)) {
      setIsSupportedOceanNetwork(true)
    } else {
      setIsSupportedOceanNetwork(false)
    }
  }, [networkId, appConfig.chainIdsSupported])

  // -----------------------------------
  // Handle change events
  // -----------------------------------
  async function handleChainChanged(chainId: string) {
    LoggerInstance.log('[web3] Chain changed', chainId)
    const networkId = await web3.eth.net.getId()
    setChainId(Number(chainId))
    setNetworkId(Number(networkId))
  }

  async function handleNetworkChanged(networkId: string) {
    LoggerInstance.log('[web3] Network changed', networkId)
    const chainId = await web3.eth.getChainId()
    setNetworkId(Number(networkId))
    setChainId(Number(chainId))
  }

  async function handleAccountsChanged(accounts: string[]) {
    LoggerInstance.log('[web3] Account changed', accounts[0])
    setAccountId(accounts[0])
  }

  useEffect(() => {
    if (!web3Provider || !web3) return

    web3Provider.on('chainChanged', handleChainChanged)
    web3Provider.on('networkChanged', handleNetworkChanged)
    web3Provider.on('accountsChanged', handleAccountsChanged)

    return () => {
      web3Provider.removeListener('chainChanged', handleChainChanged)
      web3Provider.removeListener('networkChanged', handleNetworkChanged)
      web3Provider.removeListener('accountsChanged', handleAccountsChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Provider, web3])

  return (
    <Web3Context.Provider
      value={{
        web3,
        web3Provider,
        web3Modal,
        web3ProviderInfo,
        accountId,
        accountEns,
        accountEnsAvatar,
        balance,
        networkId,
        chainId,
        networkDisplayName,
        networkData,
        block,
        isTestnet,
        web3Loading,
        isSupportedOceanNetwork,
        approvedBaseTokens,
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

export { Web3Provider, useWeb3, Web3Context }
export default Web3Provider
