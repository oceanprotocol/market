import React from 'react'
import Conversion from '@shared/Price/Conversion'
import styles from './Liquidity.module.css'
import Token from '../../../Asset/AssetActions/Pool/Token'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { AssetPoolShare } from './index'
import { calculateUserTVL } from '@utils/pool'

export function Liquidity({
  row,
  type
}: {
  row: AssetPoolShare
  type: string
}) {
  let price = '0'
  let liquidity = '0'

  if (type === 'user') {
    price = new Decimal(row.userLiquidity).mul(2).toString()

    // Liquidity in base token, calculated from pool share tokens.
    liquidity = calculateUserTVL(
      row.poolShare.shares,
      row.poolShare.pool.totalShares,
      row.poolShare.pool.baseTokenLiquidity
    )
  }
  if (type === 'pool') {
    price =
      isValidNumber(row.poolShare.pool.baseTokenLiquidity) &&
      isValidNumber(row.poolShare.pool.datatokenLiquidity) &&
      isValidNumber(row.poolShare.pool.spotPrice)
        ? new Decimal(row.poolShare.pool.datatokenLiquidity)
            .mul(new Decimal(row.poolShare.pool.spotPrice))
            .plus(row.poolShare.pool.baseTokenLiquidity)
            .toString()
        : '0'

    liquidity = new Decimal(row.poolShare.pool.baseTokenLiquidity)
      .mul(2)
      .toString()
  }
  return (
    <div className={styles.userLiquidity}>
      <Conversion
        price={price}
        className={styles.totalLiquidity}
        hideApproximateSymbol
      />
      <Token
        symbol={row.poolShare.pool.baseToken.symbol}
        balance={liquidity}
        noIcon
      />
    </div>
  )
}
