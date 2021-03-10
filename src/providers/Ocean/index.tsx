import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import Web3 from 'web3'
import { Ocean, Logger, Account, Config } from '@oceanprotocol/lib'
import {
  ProviderStatus,
  getAccountId,
  getBalance,
  AccountPurgatoryData,
  getAccountPurgatoryData
} from './utils'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

interface Balance {
  eth: string | undefined
  ocean: string | undefined
}

interface OceanProviderValue {
  web3: Web3 | undefined
  ocean: Ocean
  config: Config | ConfigHelperConfig
  account: Account
  isInPurgatory: boolean
  purgatoryData: AccountPurgatoryData
  accountId: string
  balance: Balance
  networkId: number | undefined
  status: ProviderStatus
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
  const [ocean, setOcean] = useState<Ocean | undefined>()
  const [account, setAccount] = useState<Account | undefined>()
  const [accountId, setAccountId] = useState<string | undefined>()
  const [networkId, setNetworkId] = useState<number | undefined>()
  const [balance, setBalance] = useState<Balance | undefined>({
    eth: undefined,
    ocean: undefined
  })

  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<AccountPurgatoryData>()
  const [config, setConfig] = useState<Config | ConfigHelperConfig>(
    initialConfig
  )
  const [status, setStatus] = useState<ProviderStatus>(
    ProviderStatus.NOT_AVAILABLE
  )

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

  const connect = useCallback(
    async (newConfig?: Config | ConfigHelperConfig) => {
      try {
        Logger.log('Connecting ...', newConfig)

        newConfig && setConfig(newConfig)

        // ========
        // config.web3Provider = web3
        const ocean = await Ocean.getInstance(config)
        setOcean(ocean)
        Logger.log('Ocean instance created.', ocean)
        // ========

        // NETWORK ID

        // const networkId = web3 && (await web3.eth.net.getId())
        // setNetworkId(networkId)
        // Logger.log('network id ', networkId)

        // ACCOUNT

        // const account = (await ocean.accounts.list())[0]
        // setAccount(account)
        // Logger.log('Account ', account)

        // ACCOUNT ID

        // const accountId = await getAccountId(web3)
        // setAccountId(accountId)
        // Logger.log('account id', accountId)

        // BALANCE

        // const balance = await getBalance(account)
        // setBalance(balance)
        // Logger.log('balance', JSON.stringify(balance))
      } catch (error) {
        Logger.error(error)
      }
    },
    [config]
  )

  async function refreshBalance() {
    const balance = account && (await getBalance(account))
    setBalance(balance)
  }

  useEffect(() => {
    if (!accountId) return
    console.log('balanc ref', accountId)
    setPurgatory(accountId)
  }, [accountId, setPurgatory])

  return (
    <OceanContext.Provider
      value={
        {
          ocean,
          account,
          accountId,
          networkId,
          balance,
          isInPurgatory,
          purgatoryData,
          status,
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
