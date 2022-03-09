import React, { ReactElement } from 'react'
import styles from './Token.module.css'
import PriceUnit from '@shared/Price/PriceUnit'
import Logo from '@shared/atoms/Logo'

export default function Token({
  symbol,
  balance,
  noIcon,
  size
}: {
  symbol: string
  balance: string
  noIcon?: boolean
  size?: 'small' | 'mini'
}): ReactElement {
  return (
    <div className={`${styles.token} ${size ? styles[size] : ''}`}>
      <figure
        className={`${styles.icon} ${symbol} ${noIcon ? styles.noIcon : ''}`}
      >
        <Logo noWordmark />
      </figure>
      <PriceUnit price={balance} symbol={symbol} size={size} />
    </div>
  )
}
