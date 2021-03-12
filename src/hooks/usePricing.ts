import { DDO, Logger, BestPrice } from '@oceanprotocol/lib'
import { useEffect, useState } from 'react'
import { TransactionReceipt } from 'web3-core'
import { Decimal } from 'decimal.js'
import { getFirstPoolPrice } from '../utils/dtUtils'
import {
  getCreatePricingPoolFeedback,
  getCreatePricingExchangeFeedback,
  getBuyDTFeedback,
  getSellDTFeedback
} from '../utils/feedback'
import { sleep } from '../utils'

import { useOcean } from '../providers/Ocean'
import { useWeb3 } from '../providers/Web3'

interface PriceOptions {
  price: number
  dtAmount: number
  oceanAmount: number
  type: 'fixed' | 'dynamic' | string
  weightOnDataToken: string
  swapFee: string
}

interface UsePricing {
  dtSymbol?: string
  dtName?: string
  createPricing: (
    priceOptions: PriceOptions
  ) => Promise<TransactionReceipt | string | void>
  sellDT: (dtAmount: number | string) => Promise<TransactionReceipt | void>
  mint: (tokensToMint: string) => Promise<TransactionReceipt | void>
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
  const { accountId } = useWeb3()
  const { ocean, config } = useOcean()
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
      case 'pool':
        messages = getCreatePricingPoolFeedback(dtSymbol)
        break
      case 'exchange':
        messages = getCreatePricingExchangeFeedback(dtSymbol)
        break
      case 'buy':
        messages = getBuyDTFeedback(dtSymbol)
        break
      case 'sell':
        messages = getSellDTFeedback(dtSymbol)
        break
    }

    setPricingStepText(messages[index])
  }

  async function mint(
    tokensToMint: string
  ): Promise<TransactionReceipt | void> {
    Logger.log('mint function', dataToken, accountId)
    const balance = new Decimal(
      await ocean.datatokens.balance(dataToken, accountId)
    )
    const tokens = new Decimal(tokensToMint)
    if (tokens.greaterThan(balance)) {
      const mintAmount = tokens.minus(balance)
      const tx = await ocean.datatokens.mint(
        dataToken,
        accountId,
        mintAmount.toString()
      )
      return tx
    }
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

  async function sellDT(
    dtAmount: number | string
  ): Promise<TransactionReceipt | void> {
    if (!ocean || !accountId) return

    if (!config.oceanTokenAddress) {
      Logger.error(`'oceanTokenAddress' not set in config`)
      return
    }

    try {
      setPricingIsLoading(true)
      setPricingError(undefined)
      setStep(1, 'sell')
      const pool = await getFirstPoolPrice(ocean, dataToken)
      if (!pool || pool.value === 0) return
      const price = new Decimal(pool.value).times(0.95).toString()
      setStep(2, 'sell')
      Logger.log('Selling token to pool', pool, accountId, price)
      const tx = await ocean.pool.sellDT(
        accountId,
        pool.address,
        `${dtAmount}`,
        price
      )
      setStep(3, 'sell')
      Logger.log('DT sell response', tx)
      return tx
    } catch (error) {
      setPricingError(error.message)
      Logger.error(error)
    } finally {
      setStep(0, 'sell')
      setPricingStepText(undefined)
      setPricingIsLoading(false)
    }
  }

  async function createPricing(
    priceOptions: PriceOptions
  ): Promise<TransactionReceipt | void> {
    if (!ocean || !accountId || !dtSymbol) return

    const {
      type,
      oceanAmount,
      price,
      weightOnDataToken,
      swapFee
    } = priceOptions

    let { dtAmount } = priceOptions
    const isPool = type === 'dynamic'

    if (!isPool && !config.fixedRateExchangeAddress) {
      Logger.error(`'fixedRateExchangeAddress' not set in config.`)
      return
    }

    setPricingIsLoading(true)
    setPricingError(undefined)

    setStep(99, 'pool')

    try {
      // if fixedPrice set dt to max amount
      if (!isPool) dtAmount = 1000
      await mint(`${dtAmount}`)

      // dtAmount for fixed price is set to max
      const tx = isPool
        ? await ocean.pool
            .create(
              accountId,
              dataToken,
              `${dtAmount}`,
              weightOnDataToken,
              `${oceanAmount}`,
              swapFee
            )
            .next((step: number) => setStep(step, 'pool'))
        : await ocean.fixedRateExchange
            .create(dataToken, `${price}`, accountId, `${dtAmount}`)
            .next((step: number) => setStep(step, 'exchange'))
      await sleep(20000)
      return tx
    } catch (error) {
      setPricingError(error.message)
      Logger.error(error)
    } finally {
      setPricingStep(0)
      setPricingStepText(undefined)
      setPricingIsLoading(false)
    }
  }

  return {
    dtSymbol,
    dtName,
    createPricing,
    buyDT,
    sellDT,
    mint,
    pricingStep,
    pricingStepText,
    pricingIsLoading,
    pricingError
  }
}

export { usePricing, UsePricing, PriceOptions }
export default usePricing
