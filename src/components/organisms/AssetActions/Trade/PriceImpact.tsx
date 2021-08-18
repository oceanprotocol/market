import React, { ReactElement, useEffect, useState } from 'react'
import Decimal from 'decimal.js'
import Tooltip from '../../../atoms/Tooltip'
import styles from './PriceImpact.module.css'

export default function PriceImpact({
  totalValue,
  tokenAmount,
  spotPrice
}: {
  /// how much the user actually pays (doesn't matter witch token it is)
  totalValue: string
  /// how many tokens the user trades (doesn't matter witch token it is)
  tokenAmount: string
  /// the spot price of the traded token (doesn't matter witch token it is))
  spotPrice: string
}): ReactElement {
  const [priceImpact, setPriceImpact] = useState<string>('0')

  async function getPriceImpact(
    totalValue: string,
    tokenAmount: string,
    spotPrice: string
  ) {
    const dtotalValue = new Decimal(totalValue)
    const dTokenAmount = new Decimal(tokenAmount)
    const dSpotPrice = new Decimal(spotPrice)
    let priceImpact = Decimal.abs(
      dtotalValue.div(dTokenAmount.times(dSpotPrice)).minus(1)
    ).mul(100)
    if (priceImpact.isNaN()) priceImpact = new Decimal(0)
    return priceImpact.toDecimalPlaces(2, Decimal.ROUND_DOWN)
  }

  useEffect(() => {
    if (!totalValue || !tokenAmount || !spotPrice) {
      setPriceImpact('0')
      return
    }

    async function init() {
      const newPriceImpact = await getPriceImpact(
        totalValue,
        tokenAmount,
        spotPrice
      )
      setPriceImpact(newPriceImpact.toString())
    }
    init()
  }, [totalValue, tokenAmount, spotPrice])

  return (
    <div className={styles.priceImpact}>
      <strong>Price impact</strong>
      <div>
        <span
          className={`${styles.number} ${
            parseInt(priceImpact) > 5 && styles.alert
          }`}
        >{`${priceImpact}%`}</span>
        <Tooltip content="The difference between the market price and estimated price due to trade size." />
      </div>
    </div>
  )
}
