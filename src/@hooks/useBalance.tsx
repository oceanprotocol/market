import { useState, useEffect, useCallback } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useMarketMetadata } from '../@context/MarketMetadata'
import {
  useNetwork,
  useAccount,
  useProvider,
  useBalance as useBalanceWagmi
} from 'wagmi'
import { getTokenBalance } from '@utils/wallet'

interface BalanceProviderValue {
  balance: UserBalance
}

function useBalance(): BalanceProviderValue {
  const { address } = useAccount()
  const { data: balanceNativeToken } = useBalanceWagmi({ address })
  const web3provider = useProvider()
  const { approvedBaseTokens } = useMarketMetadata()
  const { chain } = useNetwork()

  const [balance, setBalance] = useState<UserBalance>({
    eth: '0'
  })

  // -----------------------------------
  // Helper: Get user balance
  // -----------------------------------
  const getUserBalance = useCallback(async () => {
    if (
      !balanceNativeToken?.formatted ||
      !address ||
      !chain?.id ||
      !web3provider
    )
      return

    try {
      const userBalance = balanceNativeToken?.formatted
      const key = balanceNativeToken?.symbol.toLowerCase()
      const newBalance: UserBalance = { [key]: userBalance }

      if (approvedBaseTokens?.length > 0) {
        await Promise.all(
          approvedBaseTokens.map(async (token) => {
            const { address: tokenAddress, decimals, symbol } = token
            const tokenBalance = await getTokenBalance(
              address,
              decimals,
              tokenAddress,
              web3provider
            )
            newBalance[symbol.toLocaleLowerCase()] = tokenBalance
          })
        )
      }

      setBalance(newBalance)
      LoggerInstance.log('[useBalance] Balance: ', newBalance)
    } catch (error) {
      LoggerInstance.error('[useBalance] Error: ', error.message)
    }
  }, [address, approvedBaseTokens, chain?.id, web3provider, balanceNativeToken])

  useEffect(() => {
    getUserBalance()
  }, [getUserBalance])

  return { balance }
}

export default useBalance
