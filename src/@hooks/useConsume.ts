import { useState } from 'react'
import { consumeFeedback } from '@utils/feedback'
import {
  approve,
  Datatoken,
  FreOrderParams,
  LoggerInstance,
  OrderParams,
  Pool,
  signHash,
  ZERO_ADDRESS
} from '@oceanprotocol/lib'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'

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
  const { accountId, web3, chainId } = useWeb3()
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
    datatokenAddress: string,
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
        const datatoken = new Datatoken(web3)
        datatokenAddress = '0x50fcc2a0418b75bdcdac8c00dbb30f5771e47a04'
        // if we don't have a previous valid order, get one
        const userOwnedTokens = await datatoken.balance(
          datatokenAddress,
          accountId
        )
        console.log('balance ', userOwnedTokens, datatokenAddress)

        setStep(1)
        try {
          const config = getOceanConfig(chainId)
          const txApprove = await approve(
            web3,
            accountId,
            config.oceanTokenAddress,
            accountId,
            '1',
            false
          )
          console.log('approve tx', txApprove)

          const txApprove1 = await approve(
            web3,
            accountId,
            config.oceanTokenAddress,
            datatokenAddress,
            '1',
            false
          )
          console.log('approve tx', txApprove1)

          const providerData = JSON.stringify({ timeout: 0 })
          const message = web3.utils.soliditySha3(
            {
              t: 'bytes',
              v: web3.utils.toHex(web3.utils.asciiToHex(providerData))
            },
            { t: 'address', v: accountId },
            { t: 'address', v: ZERO_ADDRESS },
            { t: 'uint256', v: '0' }
          )
          const { v, r, s } = await signHash(web3, message, accountId)
          const orderParams = {
            consumer: accountId,
            serviceIndex: 1,
            _providerFees: {
              providerFeeAddress: accountId,
              providerFeeToken: ZERO_ADDRESS,
              providerFeeAmount: '0',
              v: v,
              r: r,
              s: s,
              providerData: web3.utils.toHex(
                web3.utils.asciiToHex(providerData)
              )
            },
            ammount: web3.utils.toWei('1')
          }
          const freParams = {
            exchangeContract: config.fixedRateExchangeAddress,
            exchangeId:
              '0xd36637edeb68e96f47bbc32ba8864d496c9c8c1fb0ed9aec466c83ebf5213bd7',
            maxBaseTokenAmount: '2',
            swapMarketFee: '0',
            marketFeeAddress: ZERO_ADDRESS
          } as FreOrderParams
          const tx = await datatoken.buyFromFreAndOrder(
            datatokenAddress,
            accountId,
            orderParams,
            freParams
          )
          console.log('order tx', tx)
          LoggerInstance.log('ordercreated', orderId)
          setStep(2)
        } catch (error) {
          console.log(error)
          setConsumeError(error.message)
          return error.message
        }
      }

      setStep(3)
      if (orderId)
        // await ocean.assets.download(
        //   did as string,
        //   orderId,
        //   dataTokenAddress,
        //   account,
        //   ''
        // )
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
