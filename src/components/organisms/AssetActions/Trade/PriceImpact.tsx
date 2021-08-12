import React, { ReactElement, useEffect, useState } from 'react'
import styles from './PriceImpact.module.css'
import Decimal from 'decimal.js'
import Tooltip from '../../../atoms/Tooltip'

export default function PriceImpact({
  totalValue,
  tokenAmmount,
  spotPrice
}: {
  /// how much the user actually pays (doesn't matter witch token it is)
  totalValue: string
  /// how many tokens the user trades (doesn't matter witch token it is)
  tokenAmmount: string
  /// the spot price of the traded token (doesn't matter witch token it is))
  spotPrice: string
}): ReactElement {
  const [priceImpact, setPriceImpact] = useState<string>('0')

  async function getPriceImpact(
    totalValue: string,
    tokenAmmount: string,
    spotPrice: string
  ) {
    const dtotalValue = new Decimal(totalValue)
    const dTokenAmmount = new Decimal(tokenAmmount)
    const dSpotPrice = new Decimal(spotPrice)
    let priceImpact = Decimal.abs(
      dtotalValue.div(dTokenAmmount.times(dSpotPrice)).minus(1)
    ).mul(100)
    if (priceImpact.isNaN()) priceImpact = new Decimal(0)
    return priceImpact.toDecimalPlaces(2, Decimal.ROUND_DOWN)
  }

  useEffect(() => {
    if (!totalValue || !tokenAmmount || !spotPrice) {
      setPriceImpact('0')
      return
    }

    async function init() {
      const newPriceImpact = await getPriceImpact(
        totalValue,
        tokenAmmount,
        spotPrice
      )

      setPriceImpact(newPriceImpact.toString())
    }

    init()
  }, [totalValue, tokenAmmount, spotPrice])

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
