import { useState } from 'react'
import { consumeFeedback } from '@utils/feedback'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useWeb3 } from '@context/Web3'

interface UseConsume {
  consume: (
    did: string,
    dataTokenAddress: string,
    serviceType: string,
    marketFeeAddress: string,
    orderId?: string
  ) => Promise<string>
  consumeStep?: number
  consumeStepText?: string
  consumeError?: string
  isLoading: boolean
}

function useConsume(): UseConsume {
  const { accountId } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [consumeStep, setConsumeStep] = useState<number | undefined>()
  const [consumeStepText, setConsumeStepText] = useState<string | undefined>()
  const [consumeError, setConsumeError] = useState<string | undefined>()

  function setStep(index: number) {
    setConsumeStep(index)
    setConsumeStepText(consumeFeedback[index])
  }

  async function consume(
    did: string,
    dataTokenAddress: string,
    serviceType = 'access',
    marketFeeAddress: string,
    orderId?: string
  ): Promise<string> {
    if (!accountId) return

    setIsLoading(true)
    setConsumeError(undefined)

    try {
      setStep(0)
      if (!orderId) {
        // if we don't have a previous valid order, get one
        // const userOwnedTokens = await ocean.accounts.getTokenBalance(
        //   dataTokenAddress,
        //   account
        // )
        // if (parseFloat(userOwnedTokens) < 1) {
        //   setConsumeError('Not enough datatokens')
        //   return 'Not enough datatokens'
        // } else {
        //   setStep(1)
        //   try {
        //     orderId = await ocean.assets.order(
        //       did as string,
        //       serviceType,
        //       accountId,
        //       undefined,
        //       marketFeeAddress,
        //       undefined,
        //       null,
        //       false
        //     )
        //     LoggerInstance.log('ordercreated', orderId)
        //     setStep(2)
        //   } catch (error) {
        //     setConsumeError(error.message)
        //     return error.message
        //   }
        // }
      }
      setStep(3)
      // if (orderId)
      //   await ocean.assets.download(
      //     did as string,
      //     orderId,
      //     dataTokenAddress,
      //     account,
      //     ''
      //   )
      setStep(4)
    } catch (error) {
      setConsumeError(error.message)
      LoggerInstance.error(error)
      return error.message
    } finally {
      setConsumeStep(undefined)
      setConsumeStepText(undefined)
      setIsLoading(false)
    }
    return undefined
  }

  return { consume, consumeStep, consumeStepText, consumeError, isLoading }
}

export { useConsume }
export default useConsume
