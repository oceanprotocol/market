import React, { ReactElement, useEffect, useState } from 'react'
import styles from './PriceImpact.module.css'
import { getSpotPrice } from '../../../../utils/subgraph'
import Decimal from 'decimal.js'
import { DDO } from '@oceanprotocol/lib'
import { usePrices } from '../../../../providers/Prices'
import Tooltip from '../../../atoms/Tooltip'

interface FiatPrices {
  oceanFiatValue: number
  datatokenFiatValue: number
}

export default function PriceImpact({
  ddo,
  oceanAmount,
  datatokenAmount,
  tradeType
}: {
  ddo: DDO
  oceanAmount: number
  datatokenAmount: number
  tradeType: string
}): ReactElement {
  const [priceImpact, setPriceImpact] = useState<string>('0')
  const { prices } = usePrices()

  function calculatePriceImpact(inputValue: number, outputValue: number) {
    console.log('inputFiatValue=', inputValue)
    console.log('outputFiatValue', outputValue)
    const difference = new Decimal(outputValue - inputValue)
    // const avg = (outputValue + inputValue) / 2
    const ration = difference.div(inputValue)
    const percent = ration.abs().mul(100).toFixed(2).toString()
    return percent.toString()
  }

  async function getFiatValues(
    oceanTokenAmount: number,
    dataTokenAmount: number,
    ddo: DDO,
    fiatPrice: number
  ) {
    console.log('dataTokenAmount=', dataTokenAmount)
    console.log('oceanTokenAmount=', oceanTokenAmount)
    const fiatPrices: FiatPrices = {
      oceanFiatValue: 0,
      datatokenFiatValue: 0
    }
    const spotPrice: number = await getSpotPrice(ddo)
    fiatPrices.datatokenFiatValue = fiatPrice * (spotPrice * dataTokenAmount)
    fiatPrices.oceanFiatValue = fiatPrice * oceanTokenAmount

    return fiatPrices
  }

  async function getPriceImpact(
    ddo: DDO,
    oceanTokenAmount: number,
    dataTokenAmount: number,
    sell: boolean,
    fiatPrice: number
  ) {
    const fiatPrices: FiatPrices = await getFiatValues(
      oceanTokenAmount,
      dataTokenAmount,
      ddo,
      fiatPrice
    )
    const priceImpact = await calculatePriceImpact(
      sell ? fiatPrices.datatokenFiatValue : fiatPrices.oceanFiatValue,
      sell ? fiatPrices.oceanFiatValue : fiatPrices.datatokenFiatValue
    )
    return priceImpact
  }

  useEffect(() => {
    if (!oceanAmount || !datatokenAmount) {
      setPriceImpact('0')
      return
    }

    getPriceImpact(
      ddo,
      oceanAmount,
      datatokenAmount,
      tradeType === 'sell',
      (prices as any).eur
    ).then((newPriceImpact) => {
      setPriceImpact(newPriceImpact)
    })
  }, [oceanAmount, datatokenAmount, prices, ddo, tradeType])

  return (
    <div className={styles.priceImpact}>
      <strong>Expected price impact</strong>
      <strong
        className={parseInt(priceImpact) > 5 && styles.alert}
      >{` ${priceImpact}%`}</strong>
      <Tooltip content="The difference between the market price and estimated price due to trade size." />
    </div>
  )
}
