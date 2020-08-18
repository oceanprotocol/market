import React, { ReactElement } from 'react'
import styles from './Token.module.css'
import { ReactComponent as Logo } from '../../../../images/logo.svg'
import { formatCurrency } from '@coingecko/cryptoformat'

export default function Token({
  symbol,
  balance
}: {
  symbol: string
  balance: string
}): ReactElement {
  return (
    <div className={styles.token}>
      <figure className={`${styles.icon} ${symbol}`}>
        <Logo />
      </figure>
      {formatCurrency(Number(balance), '', 'en', false, true)}{' '}
      <span className={styles.symbol}>{symbol}</span>
    </div>
  )
}
