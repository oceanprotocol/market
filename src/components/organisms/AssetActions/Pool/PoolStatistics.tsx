import React, { ReactElement } from 'react'
import { Balance } from '.'
import styles from './PoolStatistics.module.css'
import Token from './Token'
import Conversion from '../../../atoms/Price/Conversion'

export default function PoolStatistics({
  price,
  dtSymbol,
  totalBalance,
  totalPoolTokens,
  swapFee
}: {
  price: string
  dtSymbol: string
  totalBalance: Balance
  totalPoolTokens: string
  swapFee: string
}): ReactElement {
  const totalLiquidityInOcean =
    totalBalance.ocean + totalBalance.datatoken * Number(price)

  return (
    <div className={styles.statistics}>
      <h3 className={styles.title}>Pool Statistics</h3>
      <Token symbol="OCEAN" balance={`${totalBalance.ocean}`} />
      <Token symbol={dtSymbol} balance={`${totalBalance.datatoken}`} />
      <Token symbol="pool shares" balance={totalPoolTokens} noIcon />
      <Token symbol="% swap fee" balance={swapFee} noIcon />
      <Conversion
        price={`${totalLiquidityInOcean}`}
        className={styles.totalLiquidity}
      />
    </div>
  )
}
