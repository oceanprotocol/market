import { useState } from 'react'
import { consumeFeedback } from '../utils/feedback'
import { DID, Logger, ServiceType } from '@oceanprotocol/lib'
import { useOcean } from '../providers/Ocean'
import { useWeb3 } from '../providers/Web3'

interface UseConsume {
  consume: (
    did: DID | string,
    dataTokenAddress: string,
    serviceType: ServiceType,
    marketFeeAddress: string,
    orderId?: string
  ) => Promise<void>
  consumeStep?: number
  consumeStepText?: string
  consumeError?: string
  isLoading: boolean
}

function useConsume(): UseConsume {
  const { accountId } = useWeb3()
  const { ocean, account } = useOcean()
  const [isLoading, setIsLoading] = useState(false)
  const [consumeStep, setConsumeStep] = useState<number | undefined>()
  const [consumeStepText, setConsumeStepText] = useState<string | undefined>()
  const [consumeError, setConsumeError] = useState<string | undefined>()

  function setStep(index: number) {
    setConsumeStep(index)
    setConsumeStepText(consumeFeedback[index])
  }

  async function consume(
    did: DID | string,
    dataTokenAddress: string,
    serviceType: ServiceType = 'access',
    marketFeeAddress: string,
    orderId?: string
  ): Promise<void> {
    if (!ocean || !account || !accountId) return

    setIsLoading(true)
    setConsumeError(undefined)

    try {
      setStep(0)
      if (!orderId) {
        // if we don't have a previous valid order, get one
        const userOwnedTokens = await ocean.accounts.getTokenBalance(
          dataTokenAddress,
          account
        )
        if (parseFloat(userOwnedTokens) < 1) {
          setConsumeError('Not enough datatokens')
        } else {
          setStep(1)
          orderId = await ocean.assets.order(
            did as string,
            serviceType,
            accountId,
            undefined,
            marketFeeAddress,
            undefined,
            false
          )
          Logger.log('order created', orderId)
          setStep(2)
        }
      }
      setStep(3)
      if (orderId)
        await ocean.assets.download(
          did as string,
          orderId,
          dataTokenAddress,
          account,
          ''
        )
      setStep(4)
    } catch (error) {
      setConsumeError(error.message)
      Logger.error(error)
    } finally {
      setConsumeStep(undefined)
      setConsumeStepText(undefined)
      setIsLoading(false)
    }
  }

  return { consume, consumeStep, consumeStepText, consumeError, isLoading }
}

export { useConsume, UseConsume }
export default useConsume
