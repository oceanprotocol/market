import React from 'react'
import Conversion from '@shared/Price/Conversion'
import styles from './Liquidity.module.css'
import Token from '../../../@shared/Token'
import Decimal from 'decimal.js'
import { AssetPoolShare } from './index'
import { calcSingleOutGivenPoolIn } from '@utils/pool'

export function Liquidity({
  row,
  type
}: {
  row: AssetPoolShare
  type: string
}) {
  let liquidity = '0'

  if (type === 'user') {
    liquidity = calcSingleOutGivenPoolIn(
      row.poolShare.pool.baseTokenLiquidity,
      row.poolShare.pool.totalShares,
      row.poolShare.shares
    )
  }
  if (type === 'pool') {
    liquidity = new Decimal(row.poolShare.pool.baseTokenLiquidity).toString()
  }
  return (
    <div className={styles.userLiquidity}>
      <Conversion
        price={liquidity}
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
