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
  ConfigHelperConfig,
  DDO
} from '@oceanprotocol/lib'

import { useWeb3 } from './Web3'
import { getDevelopmentConfig, getOceanConfig } from '../utils/ocean'
import { useAsset } from './Asset'

interface OceanProviderValue {
  ocean: Ocean
  account: Account
  config: ConfigHelperConfig
  connect: (config: ConfigHelperConfig) => Promise<void>
}

const OceanContext = createContext({} as OceanProviderValue)

function OceanProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3, accountId } = useWeb3()
  const { ddo } = useAsset()

  const [ocean, setOcean] = useState<Ocean>()
  const [account, setAccount] = useState<Account>()
  const [config, setConfig] = useState<ConfigHelperConfig>()

  // -----------------------------------
  // Helper: Create Ocean instance
  // -----------------------------------
  const connect = useCallback(
    async (config: ConfigHelperConfig) => {
      if (!web3) return

      const newConfig: ConfigHelperConfig = {
        ...config,
        web3Provider: web3
      }

      try {
        Logger.log('[ocean] Connecting Ocean...', newConfig)
        const newOcean = await Ocean.getInstance(newConfig)
        setOcean(newOcean)
        setConfig(newConfig)
        Logger.log('[ocean] Ocean instance created.', newOcean)
      } catch (error) {
        Logger.error('[ocean] Error: ', error.message)
      }
    },
    [web3]
  )

  // -----------------------------------
  // Initial connection
  // -----------------------------------
  useEffect(() => {
    // TODO: remove DDO typing once ocean.js has it
    if (!ddo?.chainId) return

    const config = {
      ...getOceanConfig(ddo?.chainId),

      // add local dev values
      ...(ddo?.chainId === 8996 && {
        ...getDevelopmentConfig()
      })
    }

    async function init() {
      await connect(config)
    }
    init()
  }, [connect, ddo])

  // -----------------------------------
  // Get user info, handle account change from web3
  // -----------------------------------
  useEffect(() => {
    if (!ocean || !accountId || !web3) return

    async function getInfo() {
      const account = (await ocean.accounts.list())[0]
      Logger.log('[ocean] Account: ', account)
      setAccount(account)
    }
    getInfo()
  }, [ocean, accountId, web3])

  return (
    <OceanContext.Provider
      value={
        {
          ocean,
          account,
          connect,
          config
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
