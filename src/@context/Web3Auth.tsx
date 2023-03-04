import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  ReactNode,
  useCallback
} from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { getEnsName } from '@utils/ens'
import useNetworkMetadata, {
  getNetworkDataById,
  getNetworkDisplayName,
  getNetworkType,
  NetworkType
} from '../@hooks/useNetworkMetadata'
import { useMarketMetadata } from './MarketMetadata'
import { getTokenBalance } from '@utils/web3'
import { getOpcsApprovedTokens } from '@utils/subgraph'
import Web3 from 'web3'
import { Web3Auth } from '@web3auth/modal'
// import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider
} from '@web3auth/base'

interface Web3AuthInterface {
  web3: Web3
  web3Auth: Web3Auth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  web3Provider: SafeEventEmitterProvider
  web3ProviderName: string
  userEmail: string
  accountId: string
  accountEns: string
  balance: UserBalance
  networkId: number
  chainId: number
  networkDisplayName: string
  networkData: EthereumListsChain
  block: number
  isTestnet: boolean
  isSupportedOceanNetwork: boolean
  approvedBaseTokens: TokenInfo[]
  connect: () => Promise<void>
  logout: () => Promise<void>
}

const refreshInterval = 20000 // 20 sec.

const Web3AuthContext = createContext({} as Web3AuthInterface)

function Web3AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const { networksList } = useNetworkMetadata()
  const { appConfig } = useMarketMetadata()

  const [web3, setWeb3] = useState<Web3>()
  const [web3Provider, setWeb3Provider] = useState<SafeEventEmitterProvider>()

  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
  const [web3ProviderName, setWeb3ProviderName] = useState<string>('web3auth')
  const [userEmail, setUserEmail] = useState<string>()
  const [networkId, setNetworkId] = useState<number>()
  const [chainId, setChainId] = useState<number>()
  const [networkDisplayName, setNetworkDisplayName] = useState<string>()
  const [networkData, setNetworkData] = useState<EthereumListsChain>()
  const [block, setBlock] = useState<number>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [accountId, setAccountId] = useState<string>()
  const [accountEns, setAccountEns] = useState<string>()
  const [balance, setBalance] = useState<UserBalance>({
    eth: '0'
  })
  const [isSupportedOceanNetwork, setIsSupportedOceanNetwork] = useState(true)
  const [approvedBaseTokens, setApprovedBaseTokens] = useState<TokenInfo[]>()

  // -----------------------------------
  // Helper: connect to web3
  // -----------------------------------
  const connect = useCallback(async () => {
    try {
      LoggerInstance.log('[web3] Connecting Web3...')
      const provider = await web3Auth.connect()
      setWeb3Provider(provider)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const web3 = new Web3(provider as any)
      setWeb3(web3)
      LoggerInstance.log('[web3] Web3 created.', web3)

      const networkId = await web3.eth.net.getId()
      setNetworkId(networkId)
      LoggerInstance.log('[web3] network id ', networkId)

      const chainId = await web3.eth.getChainId()
      setChainId(chainId)
      LoggerInstance.log('[web3] chain id ', chainId)

      const accounts = await web3.eth.getAccounts()

      LoggerInstance.log('[web3] all wallets ', accounts)

      const accountId = accounts[0]
      setAccountId(accountId)
      LoggerInstance.log('[web3] account id', accountId)

      const userInfo = await web3Auth.getUserInfo()
      setUserEmail(userInfo.email)
      LoggerInstance.log('[web3auth] getUserInfo', userInfo)
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message)
    }
  }, [web3Auth])

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
    if (!accountId || !networkId || !web3) return

    try {
      const balance: UserBalance = {
        eth: web3.utils.fromWei(await web3.eth.getBalance(accountId, 'latest'))
      }
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
  }, [accountId, approvedBaseTokens, networkId, web3])

  // -----------------------------------
  // Helper: Get user ENS name
  // -----------------------------------
  const getUserEnsName = useCallback(async () => {
    if (!accountId) return

    try {
      // const accountEns = await getEnsNameWithWeb3(
      //   accountId,
      //   web3Provider,
      //   `${networkId}`
      // )
      const accountEns = await getEnsName(accountId)
      setAccountEns(accountEns)
      accountEns &&
        LoggerInstance.log(
          `[web3] ENS name found for ${accountId}:`,
          accountEns
        )
    } catch (error) {
      LoggerInstance.error('[web3] Error: ', error.message)
    }
  }, [accountId])

  // -----------------------------------
  // Create initial Web3Auth instance
  // -----------------------------------
  useEffect(() => {
    if (web3Auth) {
      return
    }

    async function init() {
      const clientId =
        'BKby64yYsPT_n1gndsbJvR9oSp0Kkk81tx6PcvHndVJzEErs0jQaL3ecCe2qzmxiP5UM4qObcLTiifavdqArtP8' // get from https://dashboard.web3auth.io

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: '0x13881',
        rpcTarget:
          'https://polygon-mumbai.g.alchemy.com/v2/139ubWvnZOLu91g6lecqgS6PYveeZQ5K',
        displayName: 'Polygon Mumbai',
        blockExplorer: 'https://mumbai.polygonscan.com/',
        ticker: 'MATIC',
        tickerName: 'Matic'
      }

      const uiConfig = {
        appLogo:
          'https://upload.wikimedia.org/wikipedia/commons/3/32/CGI_logo.svg'
      }

      const authMode = process.env.NODE_ENV === 'production' ? 'WALLET' : 'DAPP'

      const web3AuthInstance = new Web3Auth({
        clientId,
        chainConfig,
        uiConfig,
        authMode
      })

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: 'testnet',
          uxMode: 'popup',
          whiteLabel: {
            name: 'CGI Navigate',
            logoLight:
              'https://upload.wikimedia.org/wikipedia/commons/3/32/CGI_logo.svg',
            logoDark:
              'https://upload.wikimedia.org/wikipedia/commons/3/32/CGI_logo.svg',
            defaultLanguage: 'en',
            dark: false // whether to enable dark mode. defaultValue: false
          }
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modalConfig: any = {
        [WALLET_ADAPTERS.OPENLOGIN]: {
          label: 'openlogin',
          loginMethods: {
            email_passwordless: {
              showOnModal: true
            },
            google: {
              showOnModal: false
            },
            facebook: {
              showOnModal: false
            },
            twitter: {
              showOnModal: false
            },
            reddit: {
              showOnModal: false
            },
            discord: {
              showOnModal: false
            },
            twitch: {
              showOnModal: false
            },
            apple: {
              showOnModal: false
            },
            line: {
              showOnModal: false
            },
            github: {
              showOnModal: false
            },
            kakao: {
              showOnModal: false
            },
            linkedin: {
              showOnModal: false
            },
            weibo: {
              showOnModal: false
            },
            wechat: {
              showOnModal: false
            }
          }
        }
      }
      web3AuthInstance.configureAdapter(openloginAdapter)
      await web3AuthInstance.initModal({
        modalConfig
      })

      if (web3Auth?.provider) {
        setWeb3Provider(web3Auth.provider)
      } else {
        setWeb3Auth(web3AuthInstance)
      }

      LoggerInstance.log('[web3] Web3Auth instance created.', web3AuthInstance)
    }
    init()
  }, [connect, web3Auth, web3Provider])

  // -----------------------------------
  // Reconnect automatically for returning users
  // -----------------------------------
  useEffect(() => {
    if (!web3Auth?.provider) return

    async function connectCached() {
      LoggerInstance.log(
        '[web3] Connecting to cached provider: ',
        web3Auth.provider
      )
      await connect()
    }
    connectCached()
  }, [connect, web3Auth])

  // -----------------------------------
  // Get and set approved base tokens list
  // -----------------------------------
  useEffect(() => {
    getApprovedBaseTokens(chainId || 1)
  }, [chainId, getApprovedBaseTokens])

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
  // Get and set user ENS name
  // -----------------------------------
  useEffect(() => {
    getUserEnsName()
  }, [getUserEnsName])

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
    const networkDisplayName = getNetworkDisplayName(networkData, networkId)
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
  // useEffect(() => {
  //   if (!web3Provider) return

  //   const providerInfo = getProviderInfo(web3Provider)
  //   setWeb3ProviderInfo(providerInfo)
  // }, [web3Provider])

  // -----------------------------------
  // Logout helper
  // -----------------------------------
  async function logout() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (web3 && web3.currentProvider && (web3.currentProvider as any).close) {
      await (web3.currentProvider as any).close()
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    await web3Auth.logout()
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
    <Web3AuthContext.Provider
      value={{
        web3,
        web3Provider,
        web3ProviderName,
        userEmail,
        web3Auth,
        accountId,
        accountEns,
        balance,
        networkId,
        chainId,
        networkDisplayName,
        networkData,
        block,
        isTestnet,
        isSupportedOceanNetwork,
        approvedBaseTokens,
        connect,
        logout
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  )
}

// Helper hook to access the provider values
const useWeb3Auth = (): Web3AuthInterface => useContext(Web3AuthContext)

export { Web3AuthProvider, useWeb3Auth, Web3AuthContext }
export default Web3AuthProvider
