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
import { useMarketMetadata } from './MarketMetadata'
import { useNetwork, useAccount, useProvider } from 'wagmi'
import { utils } from 'ethers'
import { getTokenBalance } from '@utils/web3'
import useNetworkMetadata from '@hooks/useNetworkMetadata'

interface Web3ProviderValue {
  balance: UserBalance
}

// const web3ModalTheme = {
//   background: 'var(--background-body)',
//   main: 'var(--font-color-heading)',
//   secondary: 'var(--brand-grey-light)',
//   border: 'var(--border-color)',
//   hover: 'var(--background-highlight)'
// }

const refreshInterval = 20000 // 20 sec.

const Web3Context = createContext({} as Web3ProviderValue)

function Web3Provider({ children }: { children: ReactNode }): ReactElement {
  const { approvedBaseTokens } = useMarketMetadata()
  const { networkData } = useNetworkMetadata()
  const { chain } = useNetwork()
  const { address } = useAccount()
  const provider = useProvider()

  const [balance, setBalance] = useState<UserBalance>({
    eth: '0'
  })

  // -----------------------------------
  // Helper: Get user balance
  // -----------------------------------
  const getUserBalance = useCallback(async () => {
    if (!address || !chain?.id || !provider) return

    try {
      const userBalance = utils.formatEther(await provider.getBalance('latest'))
      const key = networkData.nativeCurrency.symbol.toLowerCase()
      const balance: UserBalance = { [key]: userBalance }

      if (approvedBaseTokens?.length > 0) {
        await Promise.all(
          approvedBaseTokens.map(async (token) => {
            const { address, decimals, symbol } = token
            const tokenBalance = await getTokenBalance(
              address,
              decimals,
              address,
              provider
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
  }, [address, approvedBaseTokens, chain?.id, provider])

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

  return (
    <Web3Context.Provider value={{ balance }}>{children}</Web3Context.Provider>
  )
}

// Helper hook to access the provider values
const useWeb3 = (): Web3ProviderValue => useContext(Web3Context)

export { Web3Provider, useWeb3, Web3Context }
export default Web3Provider
