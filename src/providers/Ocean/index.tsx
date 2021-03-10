import React, {
  useContext,
  useState,
  createContext,
  ReactElement,
  useCallback,
  ReactNode,
  useEffect
} from 'react'
import { Ocean, Logger, Account, Config } from '@oceanprotocol/lib'
import {
  getBalance,
  AccountPurgatoryData,
  getAccountPurgatoryData,
  getDevelopmentConfig,
  getOceanConfig
} from './utils'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { useWeb3 } from '../Web3'

const refreshInterval = 5000 // 5 sec.

interface Balance {
  eth: string
  ocean: string
}

interface OceanProviderValue {
  ocean: Ocean
  config: ConfigHelperConfig | Config
  account: Account
  isInPurgatory: boolean
  purgatoryData: AccountPurgatoryData
  balance: Balance
  connect: (config?: Config) => Promise<void>
  refreshBalance: () => Promise<void>
}

const OceanContext = createContext({} as OceanProviderValue)

function OceanProvider({
  initialConfig,
  children
}: {
  initialConfig: Config | ConfigHelperConfig
  children: ReactNode
}): ReactElement {
  const { web3, accountId, networkId } = useWeb3()
  const [ocean, setOcean] = useState<Ocean>()
  const [account, setAccount] = useState<Account>()
  const [balance, setBalance] = useState<Balance>({
    eth: undefined,
    ocean: undefined
  })
  const [config, setConfig] = useState<ConfigHelperConfig | Config>(
    initialConfig
  )

  // TODO: create usePurgatory() hook instead of mixing it up with Ocean connections
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<AccountPurgatoryData>()

  const setPurgatory = useCallback(async (address: string): Promise<void> => {
    if (!address) return

    try {
      const result = await getAccountPurgatoryData(address)

      if (result?.address !== undefined) {
        setIsInPurgatory(true)
        setPurgatoryData(result)
      } else {
        setIsInPurgatory(false)
      }

      setPurgatoryData(result)
    } catch (error) {
      Logger.error(error)
    }
  }, [])

  useEffect(() => {
    if (!accountId) return
    setPurgatory(accountId)
  }, [accountId, setPurgatory])

  const connect = useCallback(
    async (newConfig?: ConfigHelperConfig | Config) => {
      if (!web3) return

      try {
        Logger.log('Connecting ...', newConfig)

        newConfig && setConfig(newConfig)

        // ========
        config.web3Provider = web3
        const ocean = await Ocean.getInstance(config)
        setOcean(ocean)
        Logger.log('Ocean instance created.', ocean)
        // ========

        // OCEAN ACCOUNT
        const account = (await ocean.accounts.list())[0]
        setAccount(account)
        Logger.log('Account ', account)

        // BALANCE
        const balance = await getBalance(account)
        setBalance(balance)
        Logger.log('balance', JSON.stringify(balance))
      } catch (error) {
        Logger.error(error)
      }
    },
    [config, web3]
  )

  useEffect(() => {
    async function init() {
      await connect()
    }
    init()
  }, [connect])

  async function refreshBalance() {
    const balance = account && (await getBalance(account))
    setBalance(balance)
  }

  // Handle account change from web3
  useEffect(() => {
    if (!accountId || !ocean) return

    async function getAccount() {
      const account = (await ocean.accounts.list())[0]
      setAccount(account)
      Logger.log('Account ', account)
    }
    getAccount()
  }, [ocean, accountId])

  // Handle network change from web3
  // useEffect(() => {
  //   if (!chainId) return

  //   async function reconnect() {
  //     const initialNewConfig = getOceanConfig(
  //       typeof chainId === 'string'
  //         ? Number(chainId.replace('0x', ''))
  //         : chainId
  //     )

  //     const newConfig = {
  //       ...initialNewConfig,

  //       // add local dev values
  //       ...(chainId === '8996' && {
  //         ...getDevelopmentConfig()
  //       })
  //     }

  //     try {
  //       await connect(newConfig)
  //     } catch (error) {
  //       Logger.error(error.message)
  //     }
  //   }
  //   reconnect()
  // }, [chainId, connect])

  // Periodically refresh wallet balance
  useEffect(() => {
    if (!account) return

    refreshBalance()
    const balanceInterval = setInterval(() => refreshBalance(), refreshInterval)

    return () => {
      clearInterval(balanceInterval)
    }
  }, [networkId, account])

  // Re-connect on mount when network is different from user network.
  // Bit nasty to just overwrite the initialConfig passed to OceanProvider
  // while it's connecting to that, but YOLO.
  // useEffect(() => {
  //   if (!web3 || !networkId) return

  //   async function init() {
  //     const chainIdWeb3 = await web3.eth.getChainId()
  //     const chainIdConfig = (config as ConfigHelperConfig).networkId

  //     // HEADS UP! MetaMask built-in `Localhost 8545` network selection
  //     // will have `1337` as chainId but we use `8996` in our config
  //     if (
  //       chainIdWeb3 === chainIdConfig ||
  //       (chainIdWeb3 === 1337 && chainIdConfig === 8996)
  //     )
  //       return

  //     await handleNetworkChanged(networkId)
  //   }
  //   init()
  // }, [web3, networkId])

  return (
    <OceanContext.Provider
      value={
        {
          ocean,
          account,
          balance,
          isInPurgatory,
          purgatoryData,
          config,
          connect,
          refreshBalance
        } as OceanProviderValue
      }
    >
      {children}
    </OceanContext.Provider>
  )
}

// Helper hook to access the provider values
const useOcean = (): OceanProviderValue => useContext(OceanContext)

export { OceanProvider, useOcean, OceanProviderValue, Balance, OceanContext }
export default OceanProvider
