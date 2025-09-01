import { useState, useEffect } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useMarketMetadata } from '../@context/MarketMetadata'
import { getTokenBalance } from '@utils/wallet'
import { useProvider } from './useProvider'
import { useAppKitAccount, useAppKitNetworkCore } from '@reown/appkit/react'
import { formatEther } from 'ethers'

interface UserBalance {
  [symbol: string]: string
}

interface BalanceProviderValue {
  balance: UserBalance
}

function useBalance(): BalanceProviderValue {
  const { address } = useAppKitAccount()
  const web3provider = useProvider()
  const { approvedBaseTokens } = useMarketMetadata()
  const { chainId } = useAppKitNetworkCore()

  const [balance, setBalance] = useState<UserBalance>({})

  // -----------------------------------
  // Fetch balances
  // -----------------------------------
  const getUserBalance = async () => {
    if (!address || !chainId || !web3provider) {
      LoggerInstance.warn('[useBalance] Missing required data:', {
        address,
        chainId,
        web3provider: !!web3provider
      })
      return
    }

    try {
      // Native balance
      const rawBalance = await web3provider.getBalance(address)
      const userBalance = formatEther(rawBalance)
      const newBalance: UserBalance = { eth: userBalance }

      // Token balances
      if (approvedBaseTokens?.length > 0) {
        await Promise.all(
          approvedBaseTokens.map(async (token) => {
            const { address: tokenAddress, decimals, symbol } = token
            try {
              const tokenBalance = await getTokenBalance(
                address,
                decimals,
                tokenAddress,
                web3provider
              )
              newBalance[symbol.toLowerCase()] = tokenBalance
            } catch (error: any) {
              LoggerInstance.error(
                '[useBalance] Error fetching token balance:',
                { symbol, tokenAddress, error: error.message }
              )
            }
          })
        )
      } else {
        LoggerInstance.warn('[useBalance] No approved base tokens found')
      }

      setBalance(newBalance)
    } catch (error: any) {
      LoggerInstance.error('[useBalance] Error: ', error.message)
    }
  }

  // Run whenever the wallet context changes
  useEffect(() => {
    getUserBalance()
  }, [address, chainId, web3provider, approvedBaseTokens])

  return { balance }
}

export default useBalance
