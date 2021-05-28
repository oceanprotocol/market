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
import { useSiteMetadata } from '../hooks/useSiteMetadata'

const refreshInterval = 20000 // 20 sec.

interface OceanProviderValue {
  oceanConfigs: ConfigHelperConfig[]
  metadataCacheUri: string
  ocean: Ocean
  config: ConfigHelperConfig
  account: Account
  balance: UserBalance
  loading: boolean
  connect: (config?: Config) => Promise<void>
  refreshBalance: () => Promise<void>
}

const OceanContext = createContext({} as OceanProviderValue)

function OceanProvider({ children }: { children: ReactNode }): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { web3, accountId, networkId } = useWeb3()

  const [oceanConfigs, setOceanConfigs] = useState<ConfigHelperConfig[]>()
  const [metadataCacheUri, setMetadataCacheUri] = useState<string>()
  const [ocean, setOcean] = useState<Ocean>()
  const [account, setAccount] = useState<Account>()
  const [balance, setBalance] = useState<UserBalance>({
    eth: undefined,
    ocean: undefined
  })
  const [config, setConfig] = useState<ConfigHelperConfig | Config>()

  // -----------------------------------
  // Initially get all supported configs
  // from ocean.js ConfigHelper
  // -----------------------------------
  useEffect(() => {
    const allConfigs = appConfig.chainIds.map((chainId: number) =>
      getOceanConfig(chainId)
    )
    setOceanConfigs(allConfigs)
    setMetadataCacheUri(allConfigs[0].metadataCacheUri)
  }, [])

  // -----------------------------------
  // Set active config
  // -----------------------------------
  // useEffect(() => {
  //   const config = {
  //     ...getOceanConfig(networkId || 'mainnet'),

  //     // add local dev values
  //     ...(networkId === 8996 && {
  //       ...getDevelopmentConfig()
  //     })
  //   }
  //   setConfig(config)
  //   // Sync config.metadataCacheUri with metadataCacheUri
  //   setMetadataCacheUri(config.metadataCacheUri)
  // }, [networkId])

  // -----------------------------------
  // Create Ocean instance
  // -----------------------------------
  const connect = useCallback(
    async (config: ConfigHelperConfig | Config) => {
      if (!web3) return

      try {
        Logger.log('[ocean] Connecting Ocean...', config)

        config.web3Provider = web3
        setConfig(config)

        const newOcean = await Ocean.getInstance(config)
        setOcean(newOcean)
        Logger.log('[ocean] Ocean instance created.', newOcean)
      } catch (error) {
        Logger.error('[ocean] Error: ', error.message)
      }
    },
    [web3]
  )

  // async function refreshBalance() {
  //   if (!ocean || !account || !web3) return

  //   const { balance } = await getUserInfo(ocean)
  //   setBalance(balance)
  // }

  // -----------------------------------
  // Initial connection
  // -----------------------------------
  useEffect(() => {
    const config = {
      ...getOceanConfig('mainnet'),

      // add local dev values
      ...(networkId === 8996 && {
        ...getDevelopmentConfig()
      })
    }

    async function init() {
      await connect(config)
    }
    init()

    // init periodic refresh of wallet balance
    // const balanceInterval = setInterval(() => refreshBalance(), refreshInterval)

    // return () => {
    //   clearInterval(balanceInterval)
    // }
  }, [connect, networkId])

  // -----------------------------------
  // Get user info, handle account change from web3
  // -----------------------------------
  // useEffect(() => {
  //   if (!ocean || !accountId || !web3) return

  //   async function getInfo() {
  //     const { account, balance } = await getUserInfo(ocean)
  //     setAccount(account)
  //     setBalance(balance)
  //   }
  //   getInfo()
  // }, [ocean, accountId, web3])

  return (
    <OceanContext.Provider
      value={
        {
          oceanConfigs,
          metadataCacheUri,
          ocean,
          account,
          balance,
          config,
          connect
          // refreshBalance
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
