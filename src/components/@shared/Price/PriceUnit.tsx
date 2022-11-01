/* eslint-disable prettier/prettier */
import React, { ReactElement } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import Conversion from './Conversion'
import styles from './PriceUnit.module.css'
import { useUserPreferences } from '@context/UserPreferences'
import SubsPriceUnit from './SubsPriceUnit'

export function formatPrice(price: string, locale: string): string {
  return formatCurrency(Number(price), '', locale, false, {
    // Not exactly clear what `significant figures` are for this library,
    // but setting this seems to give us the formatting we want.
    // See https://github.com/oceanprotocol/market/issues/70
    significantFigures: 4
  })
}

export default function PriceUnit({
  price,
  className,
  size = 'small',
  conversion,
  symbol,
  type
}: {
  price: string
  type?: string
  className?: string
  size?: 'small' | 'mini' | 'large'
  conversion?: boolean
  symbol?: string
}): ReactElement {
  const { locale } = useUserPreferences()

  return (
    <div className={`${styles.price} ${styles[size]} ${className}`}>
      {type === 'free' ? (
        <div>Free</div>
      ) : type === 'timed' ? (
        <>
          <div>
            {/* <div style={{ top: 32, bottom: 12 }}>
      <h5 className={styles.symbol}>Pricing Benchmark Ratio</h5>
    </div> */}
            <div>
              <h5 className={styles.symbol}>Subscription Options</h5>
              {Number.isNaN(Number(price))
                ? '-'
                : formatPrice(price, locale)}{' '}
              <span className={styles.symbol}>{symbol}</span>
              {conversion && <Conversion price={price} symbol={symbol} />}
            </div>
          </div>
          <SubsPriceUnit />
        </>
      ) : (
        <>
          <div>
            {Number.isNaN(Number(price)) ? '-' : formatPrice(price, locale)}{' '}
            <span className={styles.symbol}>{symbol}</span>
          </div>
          {conversion && <Conversion price={price} symbol={symbol} />}
        </>
      )}
    </div>
  )
}
