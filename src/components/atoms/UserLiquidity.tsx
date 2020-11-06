import React, { ReactElement } from 'react'
import PriceUnit from './Price/PriceUnit'
import styles from './UserLiquidity.module.css'

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
      <div>
        <span>Available:</span>
        <PriceUnit price={amount} symbol={symbol} small />
      </div>
      {amountMax && (
        <div>
          <span>Maximum:</span>
          <PriceUnit price={amountMax} symbol={symbol} small />
        </div>
      )}
    </div>
  )
}
