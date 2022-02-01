import { useState } from 'react'
import { consumeFeedback } from '@utils/feedback'
import {
  approve,
  Datatoken,
  FreOrderParams,
  LoggerInstance,
  OrderParams,
  Pool,
  ProviderFees,
  ProviderInstance,
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
        // if we don't have a previous valid order, get one
        const userOwnedTokens = await datatoken.balance(
          datatokenAddress,
          accountId
        )

        setStep(1)
        try {
          const config = getOceanConfig(chainId)
          // const txApprove = await approve(
          //   web3,
          //   accountId,
          //   config.oceanTokenAddress,
          //   accountId,
          //   '1',
          //   false
          // )
          // console.log('approve tx', txApprove)

          // const txApprove1 = await approve(
          //   web3,
          //   accountId,
          //   config.oceanTokenAddress,
          //   datatokenAddress,
          //   '1',
          //   false
          // )
          // console.log('approve tx', txApprove1)

          // diference between timeout and validUntil?
          const initializeData = await ProviderInstance.initialize(
            did,
            'fca052c239a62523be30ab8ee70c4046867f6cd89f228185fe2996ded3d23c3c',
            0,
            accountId,
            'https://providerv4.rinkeby.oceanprotocol.com'
          )
          const orderParams = {
            consumer: accountId,
            serviceIndex: 1,
            _providerFees: initializeData.providerFee
          } as OrderParams
          const freParams = {
            exchangeContract: config.fixedRateExchangeAddress,
            exchangeId:
              '0x7ac824fef114255e5e3521a161ef692ec32003916fb6f3fe985cb74790d053ca',
            maxBaseTokenAmount: web3.utils.toWei('2'),
            swapMarketFee: web3.utils.toWei('0'),
            marketFeeAddress: ZERO_ADDRESS
          } as FreOrderParams

          const esttx = await datatoken.estGasBuyFromFreAndOrder(
            datatokenAddress,
            accountId,
            orderParams,
            freParams
          )
          const tx = await datatoken.buyFromFreAndOrder(
            datatokenAddress,
            accountId,
            orderParams,
            freParams
          )

          LoggerInstance.log('ordercreated', orderId)
          setStep(2)
        } catch (error) {
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
