import { useCallback, useEffect, useState } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { PurgatoryDataAccount, getAccountPurgatoryData } from '@utils/purgatory'

interface UseAccountPurgatory {
  isInPurgatory: boolean
  purgatoryData: PurgatoryDataAccount
  isLoading: boolean
}

function useAccountPurgatory(accountId: string): UseAccountPurgatory {
  const [isInPurgatory, setIsInPurgatory] = useState(false)
  const [purgatoryData, setPurgatoryData] = useState<PurgatoryDataAccount>()
  const [isLoading, setIsLoading] = useState(false)

  const setAccountPurgatory = useCallback(
    async (address: string): Promise<void> => {
      if (!address) return

      try {
        setIsLoading(true)
        const result = await getAccountPurgatoryData(address)
        const isInPurgatory = result?.address !== undefined
        setIsInPurgatory(isInPurgatory)
        isInPurgatory && setPurgatoryData(result)
      } catch (error) {
        LoggerInstance.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!accountId) return
    setAccountPurgatory(accountId)
  }, [accountId, setAccountPurgatory])

  return {
    isInPurgatory,
    purgatoryData,
    isLoading
  }
}

export { useAccountPurgatory }
export default useAccountPurgatory
