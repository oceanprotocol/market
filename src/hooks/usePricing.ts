import { BestPrice, DDO, Logger } from '@oceanprotocol/lib'
import { useEffect, useState } from 'react'
import { TransactionReceipt } from 'web3-core'
import { Decimal } from 'decimal.js'

import { useOcean } from '@oceanprotocol/react'
import { getBuyDTFeedback, getSellDTFeedback } from '../utils/pricingFeedback'

interface UsePricing {
  dtSymbol?: string
  dtName?: string
  buyDT: (
    dtAmount: number | string,
    price: BestPrice
  ) => Promise<TransactionReceipt | void>
  pricingStep?: number
  pricingStepText?: string
  pricingError?: string
  pricingIsLoading: boolean
}

function usePricing(ddo: DDO): UsePricing {
  const { ocean, accountId, config } = useOcean()
  const [pricingIsLoading, setPricingIsLoading] = useState(false)
  const [pricingStep, setPricingStep] = useState<number>()
  const [pricingStepText, setPricingStepText] = useState<string>()
  const [pricingError, setPricingError] = useState<string>()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [dtName, setDtName] = useState<string>()

  const { dataToken, dataTokenInfo } = ddo

  // Get Datatoken info, from DDO first, then from chain
  useEffect(() => {
    if (!dataToken) return

    async function init() {
      const dtSymbol = dataTokenInfo
        ? dataTokenInfo.symbol
        : await ocean?.datatokens.getSymbol(dataToken)
      setDtSymbol(dtSymbol)

      const dtName = dataTokenInfo
        ? dataTokenInfo.name
        : await ocean?.datatokens.getName(dataToken)
      setDtName(dtName)
    }
    init()
  }, [ocean, dataToken, dataTokenInfo])

  // Helper for setting steps & feedback for all flows
  function setStep(index: number, type: 'pool' | 'exchange' | 'buy' | 'sell') {
    setPricingStep(index)
    if (!dtSymbol) return

    let messages

    switch (type) {
      case 'buy':
        messages = getBuyDTFeedback(dtSymbol)
        break
      case 'sell':
        messages = getSellDTFeedback(dtSymbol)
        break
    }

    setPricingStepText(messages[index])
  }

  async function buyDT(
    dtAmount: number | string,
    price: BestPrice
  ): Promise<TransactionReceipt | void> {
    if (!ocean || !accountId) return

    let tx

    try {
      setPricingIsLoading(true)
      setPricingError(undefined)
      setStep(1, 'buy')

      Logger.log('Price found for buying', price)
      switch (price?.type) {
        case 'pool': {
          const oceanAmmount = new Decimal(price.value).times(1.05).toString()
          const maxPrice = new Decimal(price.value).times(2).toString()
          setStep(2, 'buy')
          Logger.log('Buying token from pool', price, accountId, price)
          tx = await ocean.pool.buyDT(
            accountId,
            price.address,
            String(dtAmount),
            oceanAmmount,
            maxPrice
          )
          setStep(3, 'buy')
          Logger.log('DT buy response', tx)
          break
        }
        case 'exchange': {
          if (!config.oceanTokenAddress) {
            Logger.error(`'oceanTokenAddress' not set in config`)
            return
          }
          if (!config.fixedRateExchangeAddress) {
            Logger.error(`'fixedRateExchangeAddress' not set in config`)
            return
          }
          Logger.log('Buying token from exchange', price, accountId)
          await ocean.datatokens.approve(
            config.oceanTokenAddress,
            config.fixedRateExchangeAddress,
            `${price.value}`,
            accountId
          )
          setStep(2, 'buy')
          tx = await ocean.fixedRateExchange.buyDT(
            price.address,
            `${dtAmount}`,
            accountId
          )
          setStep(3, 'buy')
          Logger.log('DT exchange buy response', tx)
          break
        }
      }
    } catch (error) {
      setPricingError(error.message)
      Logger.error(error)
    } finally {
      setStep(0, 'buy')
      setPricingStepText(undefined)
      setPricingIsLoading(false)
    }

    return tx
  }

  return {
    dtSymbol,
    dtName,
    buyDT,
    pricingStep,
    pricingStepText,
    pricingIsLoading,
    pricingError
  }
}

export { usePricing, UsePricing }
export default usePricing
