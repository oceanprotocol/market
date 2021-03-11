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
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import { useWeb3 } from './Web3'
import {
  Balance,
  getDevelopmentConfig,
  getOceanConfig,
  getUserInfo
} from '../utils/ocean'

const refreshInterval = 20000 // 20 sec.

interface OceanProviderValue {
  ocean: Ocean
  config: ConfigHelperConfig | Config
  account: Account
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

  // -----------------------------------
  // Create Ocean instance
  // -----------------------------------
  const connect = useCallback(
    async (newConfig?: ConfigHelperConfig | Config) => {
      if (!web3) return

      try {
        const usedConfig = newConfig || config
        Logger.log('Connecting Ocean...', usedConfig)

        usedConfig.web3Provider = web3

        if (newConfig) {
          setConfig(usedConfig)
        }

        const newOcean = await Ocean.getInstance(usedConfig)
        setOcean(newOcean)
        Logger.log('Ocean instance created.', newOcean)
      } catch (error) {
        Logger.error(error)
      }
    },
    [web3, config]
  )

  async function refreshBalance() {
    if (!ocean || !account) return

    const { balance } = await getUserInfo(ocean)
    Logger.log('balance', JSON.stringify(balance))
    setBalance(balance)
  }

  // -----------------------------------
  // Initial connection
  // -----------------------------------
  useEffect(() => {
    async function init() {
      await connect()
    }
    init()

    // init periodic refresh of wallet balance
    const balanceInterval = setInterval(() => refreshBalance(), refreshInterval)

    return () => {
      clearInterval(balanceInterval)
    }
  }, [])

  // -----------------------------------
  // Get user info, handle account change from web3
  // -----------------------------------
  useEffect(() => {
    if (!ocean || !accountId) return

    async function getInfo() {
      const { account, balance } = await getUserInfo(ocean)
      setAccount(account)
      setBalance(balance)
    }
    getInfo()
  }, [ocean, accountId])

  // -----------------------------------
  // Handle network change from web3
  // -----------------------------------
  useEffect(() => {
    if (!networkId) return

    async function reconnect() {
      const newConfig = {
        ...getOceanConfig(networkId),

        // add local dev values
        ...(networkId === 8996 && {
          ...getDevelopmentConfig()
        })
      }

      try {
        await connect(newConfig)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    reconnect()
  }, [networkId])

  return (
    <OceanContext.Provider
      value={
        {
          ocean,
          account,
          balance,
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
