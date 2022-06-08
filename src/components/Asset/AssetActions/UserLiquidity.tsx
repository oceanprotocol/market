import React, { ReactElement } from 'react'
import PriceUnit from '@shared/Price/PriceUnit'
import styles from './UserLiquidity.module.css'
import { useUserPreferences } from '@context/UserPreferences'
import { usePrices } from '@context/Prices'

function UserLiquidityLine({
  title,
  amount,
  symbol
}: {
  title: string
  amount: string
  symbol: string
}) {
  const { locale, currency } = useUserPreferences()
  const { prices } = usePrices()

  return (
    <div>
      <span>{title}</span>
      <PriceUnit
        price={amount}
        symbol={symbol}
        size="small"
        locale={locale}
        currency={currency}
        prices={prices}
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
        />
      )}
    </div>
  )
}
