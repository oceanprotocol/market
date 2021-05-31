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
import { getDevelopmentConfig, getOceanConfig } from '../utils/ocean'
import { useAsset } from './Asset'

interface OceanProviderValue {
  ocean: Ocean
  account: Account
  connect: (config: Config) => Promise<void>
}

const OceanContext = createContext({} as OceanProviderValue)

function OceanProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3, accountId } = useWeb3()
  const { ddo } = useAsset()

  const [ocean, setOcean] = useState<Ocean>()
  const [account, setAccount] = useState<Account>()

  // -----------------------------------
  // Helper: Create Ocean instance
  // -----------------------------------
  const connect = useCallback(
    async (config: ConfigHelperConfig | Config) => {
      if (!web3 || !ddo) return

      const newConfig: Config = {
        ...config,
        web3Provider: web3
      }

      try {
        Logger.log('[ocean] Connecting Ocean...', newConfig)
        const newOcean = await Ocean.getInstance(newConfig)
        setOcean(newOcean)
        Logger.log('[ocean] Ocean instance created.', newOcean)
      } catch (error) {
        Logger.error('[ocean] Error: ', error.message)
      }
    },
    [web3, ddo]
  )

  // -----------------------------------
  // Initial connection
  // -----------------------------------
  useEffect(() => {
    if (!ddo?.chainId) return

    const config = {
      ...getOceanConfig(ddo.chainId),

      // add local dev values
      ...(ddo.chainId === 8996 && {
        ...getDevelopmentConfig()
      })
    }

    async function init() {
      await connect(config)
    }
    init()
  }, [connect, ddo?.chainId])

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
