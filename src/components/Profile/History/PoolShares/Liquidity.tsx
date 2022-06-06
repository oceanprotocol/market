import React, { useEffect, useState } from 'react'
import Conversion from '@shared/Price/Conversion'
import styles from './Liquidity.module.css'
import Token from '../../../@shared/Token'
import Decimal from 'decimal.js'
import { AssetPoolShare } from './index'
import { calcSingleOutGivenPoolIn } from '@utils/pool'
import { useUserPreferences } from '@context/UserPreferences'
import { usePrices } from '@context/Prices'

export function Liquidity({
  row,
  type
}: {
  row: AssetPoolShare
  type: string
}) {
  const [liquidity, setLiquidity] = useState('0')
  const { locale, currency } = useUserPreferences()
  const { prices } = usePrices()

  useEffect(() => {
    let calculatedLiquidity = '0'
    if (type === 'user') {
      calculatedLiquidity = calcSingleOutGivenPoolIn(
        row.poolShare.pool.baseTokenLiquidity,
        row.poolShare.pool.totalShares,
        row.poolShare.shares
      )
    }
    if (type === 'pool') {
      calculatedLiquidity = new Decimal(
        row.poolShare.pool.baseTokenLiquidity
      ).toString()
    }
    setLiquidity(calculatedLiquidity)
  }, [
    row.poolShare.pool.baseTokenLiquidity,
    row.poolShare.pool.totalShares,
    row.poolShare.shares,
    type
  ])

  return (
    <div className={styles.userLiquidity}>
      <Conversion
        price={liquidity}
        className={styles.totalLiquidity}
        hideApproximateSymbol
        locale={locale}
        currency={currency}
        prices={prices}
      />
      <Token
        symbol={row.poolShare.pool.baseToken.symbol}
        balance={liquidity}
        noIcon
      />
    </div>
  )
}
