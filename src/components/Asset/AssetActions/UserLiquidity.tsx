import React, { FormEvent, ReactElement } from 'react'
import PriceUnit from '@shared/Price/PriceUnit'
import styles from './UserLiquidity.module.css'

function UserLiquidityLine({
  title,
  amount,
  symbol,
  amountMax,
  onClick
}: {
  title: string
  amount: string
  symbol: string
  amountMax?: boolean
  onClick?: () => void
}) {
  return (
    <div>
      <span>{title}</span>
      <PriceUnit
        className={amountMax ? styles.maxAmount : ''}
        price={amount}
        symbol={symbol}
        size="small"
      />
    </div>
  )
}

export default function UserLiquidity({
  amount,
  symbol,
  amountMax,
  titleAvailable = 'Balance',
  titleMaximum = 'Maximum'
}: {
  amount: string
  symbol: string
  titleAvailable?: string
  titleMaximum?: string
  amountMax?: string
}): ReactElement {
  return (
    <div className={styles.userLiquidity}>
      <UserLiquidityLine
        title={titleAvailable}
        amount={amount}
        symbol={symbol}
      />
      {amountMax && (
        <UserLiquidityLine
          title={titleMaximum}
          amount={amountMax}
          symbol={symbol}
          amountMax
        />
      )}
    </div>
  )
}
