import React, { ReactElement } from 'react'
import PriceUnit from '@shared/Price/PriceUnit'
import styles from './UserLiquidity.module.css'

function UserLiquidityLine({
  title,
  amount,
  symbol,
  isAmountMax,
  name,
  selectMaxAmount
}: {
  title: string
  amount: string
  symbol: string
  isAmountMax?: boolean
  name?: string
  selectMaxAmount?: (name: string, amount: string) => void
}) {
  return (
    <div>
      <span>{title}</span>
      {isAmountMax ? (
        <span
          className={styles.maxAmount}
          onClick={() => selectMaxAmount(name, amount)}
        >
          <PriceUnit
            className={isAmountMax ? styles.maxAmount : ''}
            price={amount}
            symbol={symbol}
            size="mini"
          />
        </span>
      ) : (
        <PriceUnit
          className={isAmountMax ? styles.maxAmount : ''}
          price={amount}
          symbol={symbol}
          size="small"
        />
      )}
    </div>
  )
}

export default function UserLiquidity({
  amount,
  symbol,
  amountMax,
  titleAvailable = 'Balance',
  titleMaximum = 'Maximum',
  name,
  selectMaxAmount
}: {
  amount: string
  symbol: string
  titleAvailable?: string
  titleMaximum?: string
  amountMax?: string
  name?: string
  selectMaxAmount?: (name: string, amount: string) => void
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
          isAmountMax
          name={name}
          selectMaxAmount={selectMaxAmount}
        />
      )}
    </div>
  )
}
