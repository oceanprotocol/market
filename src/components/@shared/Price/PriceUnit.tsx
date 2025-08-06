import React, { ReactElement } from 'react'
import Conversion from './Conversion'
import styles from './PriceUnit.module.css'
import { useUserPreferences } from '@context/UserPreferences'
import { formatNumber } from '@utils/numbers'

export default function PriceUnit({
  price,
  className,
  size = 'small',
  conversion,
  symbol,
  decimals
}: {
  price: number
  className?: string
  size?: 'small' | 'mini' | 'large'
  conversion?: boolean
  symbol?: string
  decimals?: string
}): ReactElement {
  const { locale } = useUserPreferences()

  if (price === 0) {
    return (
      <div className={`${styles.price} ${styles[size]} ${className}`}>Free</div>
    )
  }

  if (isNaN(price)) {
    return (
      <div className={`${styles.price} ${styles[size]} ${className}`}>
        Invalid Price
      </div>
    )
  }

  return (
    <div className={`${styles.price} ${styles[size]} ${className}`}>
      <>
        <div>
          {formatNumber(price, locale, decimals)}
          <span className={styles.symbol}>{symbol}</span>
        </div>
        {conversion && <Conversion price={price} symbol={symbol} />}
      </>
    </div>
  )
}
