import React, {
  useContext,
  useState,
  createContext,
  ReactElement,
  useCallback,
  ReactNode,
  useEffect
} from 'react'
import { Config, LoggerInstance } from '@oceanprotocol/lib'
import { useWeb3 } from './Web3'
import { getDevelopmentConfig, getOceanConfig } from '@utils/ocean'
import { useAsset } from './Asset'

interface OceanProviderValue {
  config: Config
}

const OceanContext = createContext({} as OceanProviderValue)

function OceanProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3, accountId } = useWeb3()
  const { ddo } = useAsset()

  const [config, setConfig] = useState<Config>()

  // -----------------------------------
  // Helper: Create Ocean instance
  // -----------------------------------
  const connect = useCallback(
    async (config: Config) => {
      if (!web3) return

      const newConfig: Config = {
        ...config,
        web3Provider: web3
      }

      try {
        LoggerInstance.log(
          '[ocean] Connecting Ocean...  not anymore ',
          newConfig
        )

        setConfig(newConfig)
      } catch (error) {
        LoggerInstance.error('[ocean] Error: ', error.message)
      }
    },
    [web3]
  )

  // -----------------------------------
  // Initial asset details connection
  // -----------------------------------
  useEffect(() => {
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
  // useEffect(() => {
  //   if ( !accountId || !web3) return

  //   async function getInfo() {
  //     const account = (await ocean.accounts.list())[0]
  //     LoggerInstance.log('[ocean] Account: ', account)
  //     setAccount(account)
  //   }
  //   getInfo()
  // }, [ocean, accountId, web3])

  return (
    <OceanContext.Provider
      value={
        {
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

export { OceanProvider, useOcean, OceanContext }
export default OceanProvider
