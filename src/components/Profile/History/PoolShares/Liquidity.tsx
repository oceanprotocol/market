import React from 'react'
import Conversion from '@shared/Price/Conversion'
import styles from './Liquidity.module.css'
import Token from '../../../Asset/AssetActions/Pool/Token'
import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'
import { AssetPoolShare } from './index'

export function Liquidity({
  row,
  type
}: {
  row: AssetPoolShare
  type: string
}) {
  let price = ''
  let oceanTokenBalance = ''
  let dataTokenBalance = ''

  if (type === 'user') {
    price = row.userLiquidity
    const userShare = row.poolShare.shares / row.poolShare.pool.totalShares
    oceanTokenBalance = (
      userShare * row.poolShare.pool.baseTokenLiquidity
    ).toString()
    dataTokenBalance = (
      userShare * row.poolShare.pool.datatokenLiquidity
    ).toString()
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

    oceanTokenBalance = row.poolShare.pool.baseTokenLiquidity.toString()
    dataTokenBalance = row.poolShare.pool.datatokenLiquidity.toString()
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
        balance={oceanTokenBalance}
        noIcon
      />
      <Token
        symbol={row.poolShare.pool.datatoken.symbol}
        balance={dataTokenBalance}
        noIcon
      />
    </div>
  )
}
