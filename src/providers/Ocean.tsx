import React, {
  useContext,
  useState,
  createContext,
  ReactElement,
  useCallback,
  ReactNode,
  useEffect
} from 'react'
import {
  Ocean,
  Logger,
  Account,
  Config,
  ConfigHelperConfig
} from '@oceanprotocol/lib'

import { useWeb3 } from './Web3'
import {
  getDevelopmentConfig,
  getOceanConfig,
  getUserInfo
} from '../utils/ocean'
import { UserBalance } from '../@types/TokenBalance'

const refreshInterval = 20000 // 20 sec.

interface OceanProviderValue {
  ocean: Ocean
  config: ConfigHelperConfig
  account: Account
  balance: UserBalance
  loading: boolean
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
  const [balance, setBalance] = useState<UserBalance>({
    eth: undefined,
    ocean: undefined
  })
  const [config, setConfig] =
    useState<ConfigHelperConfig | Config>(initialConfig)
  const [loading, setLoading] = useState<boolean>()

  // -----------------------------------
  // Create Ocean instance
  // -----------------------------------
  const connect = useCallback(
    async (newConfig?: ConfigHelperConfig | Config) => {
      setLoading(true)
      try {
        const usedConfig = newConfig || config
        Logger.log('[ocean] Connecting Ocean...', usedConfig)
        usedConfig.web3Provider = web3 || initialConfig.web3Provider

        if (newConfig) {
          await setConfig(usedConfig)
        }

        if (usedConfig.web3Provider) {
          const newOcean = await Ocean.getInstance(usedConfig)
          await setOcean(newOcean)
          Logger.log('[ocean] Ocean instance created.', newOcean)
        }
        setLoading(false)
      } catch (error) {
        Logger.error('[ocean] Error: ', error.message)
      }
    },
    [web3, config, initialConfig.web3Provider]
  )

  async function refreshBalance() {
    if (!ocean || !account || !web3) return

    const { balance } = await getUserInfo(ocean)
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
    if (!ocean || !accountId || !web3) return

    async function getInfo() {
      const { account, balance } = await getUserInfo(ocean)
      setAccount(account)
      setBalance(balance)
    }
    getInfo()
  }, [ocean, accountId, web3])

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
        setLoading(true)
        await connect(newConfig)
        setLoading(false)
      } catch (error) {
        Logger.error('[ocean] Error: ', error.message)
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
          loading,
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

export { OceanProvider, useOcean, OceanProviderValue, OceanContext }
export default OceanProvider
