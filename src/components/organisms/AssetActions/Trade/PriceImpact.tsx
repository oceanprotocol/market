import React, { ReactElement, useEffect, useState } from 'react'
import styles from './PriceImpact.module.css'
import { getSpotPrice } from '../../../../utils/subgraph'
import Decimal from 'decimal.js'
import { DDO } from '@oceanprotocol/lib'
import Tooltip from '../../../atoms/Tooltip'

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

  function calculatePriceImpact(inputValue: number, outputValue: number) {
    console.log('inputOceanValue=', inputValue)
    console.log('outputOceanValue', outputValue)
    const bestPrice = (outputValue + inputValue) / 2
    const difference = outputValue - bestPrice
    const ration = difference / inputValue
    const percent = new Decimal(ration).abs().mul(100).toFixed(2).toString()
    return percent.toString()
  }

  async function getDatatokenOceanValue(dataTokenAmount: number, ddo: DDO) {
    console.log('dataTokenAmount=', dataTokenAmount)
    const spotPrice: number = await getSpotPrice(ddo)
    const datatokenOceanValue = spotPrice * dataTokenAmount
    return datatokenOceanValue
  }

  async function getPriceImpact(
    ddo: DDO,
    oceanTokenAmount: number,
    dataTokenAmount: number,
    sell: boolean
  ) {
    const datatokenOceanValue: number = await getDatatokenOceanValue(
      dataTokenAmount,
      ddo
    )
    const priceImpact = await calculatePriceImpact(
      sell ? datatokenOceanValue : oceanTokenAmount,
      sell ? oceanTokenAmount : datatokenOceanValue
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
      tradeType === 'sell'
    ).then((newPriceImpact) => {
      setPriceImpact(newPriceImpact)
    })
  }, [oceanAmount, datatokenAmount, ddo, tradeType])

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
