import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { useState } from 'react'
import { TransactionReceipt } from 'web3-core'
import { Decimal } from 'decimal.js'
import {
  getCreatePricingPoolFeedback,
  getCreatePricingExchangeFeedback,
  getBuyDTFeedback,
  getCreateFreePricingFeedback,
  getDispenseFeedback
} from '@utils/feedback'
import { sleep } from '@utils/index'
import { useOcean } from '@context/Ocean'
import { useWeb3 } from '@context/Web3'

interface UsePricing {
  getDTSymbol: (ddo: Asset) => Promise<string>
  getDTName: (ddo: Asset) => Promise<string>
  createPricing: (
    priceOptions: PriceOptions,
    ddo: Asset
  ) => Promise<TransactionReceipt | string | void>
  mint: (tokensToMint: string, ddo: Asset) => Promise<TransactionReceipt | void>
  buyDT: (
    amountDataToken: number | string,
    price: BestPrice,
    ddo: Asset
  ) => Promise<TransactionReceipt | void>
  pricingStep?: number
  pricingStepText?: string
  pricingError?: string
  pricingIsLoading: boolean
}

function usePricing(): UsePricing {
  const { accountId } = useWeb3()
  const { config } = useOcean()
  const [pricingIsLoading, setPricingIsLoading] = useState(false)
  const [pricingStep, setPricingStep] = useState<number>()
  const [pricingStepText, setPricingStepText] = useState<string>()
  const [pricingError, setPricingError] = useState<string>()

  async function getDTSymbol(ddo: Asset): Promise<string> {
    if (!accountId) return

    const { datatokens } = ddo
    return datatokens[0].symbol
    // return dataTokenInfo
    //   ? dataTokenInfo.symbol
    //   : await ocean?.datatokens.getSymbol(dataTokenInfo.address)
  }

  async function getDTName(ddo: Asset): Promise<string> {
    if (!accountId) return
    const { datatokens } = ddo
    return datatokens[0].name
    // return dataTokenInfo
    //   ? dataTokenInfo.name
    //   : await ocean?.datatokens.getName(dataTokenInfo.address)
  }

  // Helper for setting steps & feedback for all flows
  async function setStep(
    index: number,
    type: 'pool' | 'exchange' | 'free' | 'buy' | 'dispense',
    ddo: Asset
  ) {
    const dtSymbol = await getDTSymbol(ddo)
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
      case 'free':
        messages = getCreateFreePricingFeedback(dtSymbol)
        break
      case 'buy':
        messages = getBuyDTFeedback(dtSymbol)
        break
      case 'dispense':
        messages = getDispenseFeedback(dtSymbol)
        break
    }

    setPricingStepText(messages[index])
  }

  async function mint(
    tokensToMint: string,
    ddo: Asset
  ): Promise<TransactionReceipt | void> {
    const { datatokens } = ddo
    LoggerInstance.log('mint function', datatokens[0].address, accountId)
    // const balance = new Decimal(
    //   await ocean.datatokens.balance(dataTokenInfo.address, accountId)
    // )
    // const tokens = new Decimal(tokensToMint)
    // if (tokens.greaterThan(balance)) {
    //   const mintAmount = tokens.minus(balance)
    //   const tx = await ocean.datatokens.mint(
    //     dataTokenInfo.address,
    //     accountId,
    //     mintAmount.toString()
    //   )
    //   return tx
    // }
  }

  async function buyDT(
    amountDataToken: number | string,
    price: BestPrice,
    ddo: Asset
  ): Promise<TransactionReceipt | void> {
    if (!accountId) return

    let tx

    try {
      setPricingIsLoading(true)
      setPricingError(undefined)
      setStep(1, 'buy', ddo)

      LoggerInstance.log('Price found for buying', price)
      Decimal.set({ precision: 18 })

      switch (price?.type) {
        case 'dynamic': {
          const oceanAmmount = new Decimal(price.value).times(1.05).toString()
          const maxPrice = new Decimal(price.value).times(2).toString()

          setStep(2, 'buy', ddo)
          LoggerInstance.log(
            'Buying token from pool',
            price,
            accountId,
            oceanAmmount,
            maxPrice
          )
          // tx = await ocean.pool.buyDT(
          //   accountId,
          //   price.address,
          //   String(amountDataToken),
          //   oceanAmmount,
          //   maxPrice
          // )
          setStep(3, 'buy', ddo)
          LoggerInstance.log('DT buy response', tx)
          break
        }
        case 'fixed': {
          if (!config.oceanTokenAddress) {
            LoggerInstance.error(`'oceanTokenAddress' not set in config`)
            return
          }
          if (!config.fixedRateExchangeAddress) {
            LoggerInstance.error(`'fixedRateExchangeAddress' not set in config`)
            return
          }
          LoggerInstance.log('Buying token from exchange', price, accountId)
          // await ocean.datatokens.approve(
          //   config.oceanTokenAddress,
          //   config.fixedRateExchangeAddress,
          //   `${price.value}`,
          //   accountId
          // )
          setStep(2, 'buy', ddo)
          // tx = await ocean.fixedRateExchange.buyDT(
          //   price.address,
          //   `${amountDataToken}`,
          //   accountId
          // )
          setStep(3, 'buy', ddo)
          LoggerInstance.log('DT exchange buy response', tx)
          break
        }
        case 'free': {
          setStep(1, 'dispense', ddo)
          // const isDispensable = await ocean.OceanDispenser.isDispensable(
          //   ddo?.services[0].datatokenAddress,
          //   accountId,
          //   '1'
          // )

          // if (!isDispensable) {
          //   LoggerInstance.error(
          //     `Dispenser for ${ddo?.services[0].datatokenAddress} failed to dispense`
          //   )
          //   return
          // }

          // tx = await ocean.OceanDispenser.dispense(
          //   ddo?.services[0].datatokenAddress,
          //   accountId,
          //   '1'
          // )
          setStep(2, 'dispense', ddo)
          LoggerInstance.log('DT dispense response', tx)
          break
        }
      }
    } catch (error) {
      setPricingError(error.message)
      LoggerInstance.error(error)
    } finally {
      setStep(0, 'buy', ddo)
      setPricingStepText(undefined)
      setPricingIsLoading(false)
    }

    return tx
  }

  async function createPricing(
    priceOptions: PriceOptions,
    ddo: Asset
  ): Promise<TransactionReceipt | void> {
    const dataToken = ddo?.services[0].datatokenAddress
    const dtSymbol = await getDTSymbol(ddo)

    if (!accountId || !dtSymbol) return

    const { type, amountOcean, price, weightOnDataToken, swapFee } =
      priceOptions

    let { amountDataToken } = priceOptions
    const isPool = type === 'dynamic'

    if (!isPool && !config.fixedRateExchangeAddress) {
      LoggerInstance.error(`'fixedRateExchangeAddress' not set in config.`)
      return
    }

    setPricingIsLoading(true)
    setPricingError(undefined)

    setStep(99, 'pool', ddo)

    try {
      if (type === 'free') {
        setStep(99, 'free', ddo)
        // await ocean.OceanDispenser.activate(dataToken, '1', '1', accountId)
      } else {
        // if fixedPrice set dt to max amount
        if (!isPool) amountDataToken = 1000
        await mint(`${amountDataToken}`, ddo)
      }

      // amountDataToken for fixed price is set to max
      // const tx = isPool
      //   ? await ocean.pool
      //       .create(
      //         accountId,
      //         dataToken,
      //         `${amountDataToken}`,
      //         weightOnDataToken,
      //         `${amountOcean}`,
      //         `${swapFee}`
      //       )
      //       .next((step: number) => setStep(step, 'pool', ddo))
      //   : type === 'fixed'
      //   ? await ocean.fixedRateExchange
      //       .create(dataToken, `${price}`, accountId, `${amountDataToken}`)
      //       .next((step: number) => setStep(step, 'exchange', ddo))
      //   : await ocean.OceanDispenser.makeMinter(dataToken, accountId).next(
      //       (step: number) => setStep(step, 'free', ddo)
      //     )
      // we should remove this sleep , why do we have sleep for 20 seconds !?!?!?!?!?!?!!?
      // await sleep(20000)
      // return tx
    } catch (error) {
      setPricingError(error.message)
      LoggerInstance.error(error)
    } finally {
      setPricingStep(0)
      setPricingStepText(undefined)
      setPricingIsLoading(false)
    }
  }

  return {
    getDTSymbol,
    getDTName,
    createPricing,
    buyDT,
    mint,
    pricingStep,
    pricingStepText,
    pricingIsLoading,
    pricingError
  }
}

export { usePricing }
export default usePricing
