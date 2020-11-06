import React, { ReactElement } from 'react'
import PriceUnit from './Price/PriceUnit'
import styles from './UserLiquidity.module.css'

function UserLiquidityLine({
  title,
  amount,
  symbol
}: {
  title: string
  amount: string
  symbol: string
}) {
  return (
    <div>
      <span>{title}</span>
      <PriceUnit price={amount} symbol={symbol} small />
    </div>
  )
}

export default function UserLiquidity({
  amount,
  symbol,
  amountMax
}: {
  amount: string
  symbol: string
  amountMax?: string
}): ReactElement {
  return (
    <div className={styles.userLiquidity}>
      <UserLiquidityLine title="Available" amount={amount} symbol={symbol} />
      {amountMax && (
        <UserLiquidityLine title="Maximum" amount={amountMax} symbol={symbol} />
      )}
    </div>
  )
}
