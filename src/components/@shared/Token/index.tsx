import React, { ReactElement } from 'react'
import styles from './index.module.css'
import PriceUnit from '@shared/Price/PriceUnit'
import Logo from '@shared/atoms/Logo'
import Conversion from '@shared/Price/Conversion'
import { Prices } from '@context/Prices'

export interface TokenProps {
  symbol: string
  balance: string
  conversion?: boolean
  noIcon?: boolean
  size?: 'small' | 'mini'
  locale: string
  currency: string
  prices: Prices
}

export default function Token({
  symbol,
  balance,
  conversion,
  noIcon,
  size,
  locale,
  currency,
  prices
}: TokenProps): ReactElement {
  return (
    <>
      <div className={`${styles.token} ${size ? styles[size] : ''}`}>
        <figure
          className={`${styles.icon} ${symbol} ${noIcon ? styles.noIcon : ''}`}
        >
          <Logo noWordmark />
        </figure>
        <PriceUnit
          price={balance}
          symbol={symbol}
          size={size}
          locale={locale}
          prices={prices}
          currency={currency}
        />
      </div>
      {conversion && (
        <Conversion
          price={balance}
          className={`${styles.conversion}`}
          locale={locale}
          prices={prices}
          currency={currency}
        />
      )}
    </>
  )
}
