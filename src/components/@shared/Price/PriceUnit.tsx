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
  type,
  decimals
}: {
  price: number
  type?: string
  className?: string
  size?: 'small' | 'mini' | 'large'
  conversion?: boolean
  symbol?: string
  decimals?: string
}): ReactElement {
  const { locale } = useUserPreferences()

  return (
    <div className={`${styles.price} ${styles[size]} ${className}`}>
      {type === 'free' ? (
        <div>Free</div>
      ) : (
        <>
          <div>
            {Number.isNaN(price) ? '-' : formatNumber(price, locale, decimals)}{' '}
            <span className={styles.symbol}>{symbol}</span>
          </div>
          {conversion && <Conversion price={price} symbol={symbol} />}
        </>
      )}
    </div>
  )
}
