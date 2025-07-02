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
    ) {
      LoggerInstance.warn('[useBalance] Missing required data:', {
        balanceNativeToken: balanceNativeToken?.formatted,
        address,
        chainId: chain?.id,
        web3provider: !!web3provider
      })
      return
    }

    try {
      const userBalance = balanceNativeToken?.formatted
      const key = balanceNativeToken?.symbol.toLowerCase()
      const newBalance: UserBalance = { [key]: userBalance }

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
              newBalance[symbol.toLocaleLowerCase()] = tokenBalance
            } catch (error) {
              LoggerInstance.error(
                '[useBalance] Error fetching token balance:',
                {
                  symbol,
                  tokenAddress,
                  error: error.message
                }
              )
            }
          })
        )
      } else {
        LoggerInstance.warn('[useBalance] No approved base tokens found')
      }
      setBalance(newBalance)
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
