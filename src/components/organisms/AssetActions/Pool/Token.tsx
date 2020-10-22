import React, { ReactElement } from 'react'
import styles from './Token.module.css'
import { ReactComponent as Logo } from '../../../../images/logo.svg'
import PriceUnit from '../../../atoms/Price/PriceUnit'

export default function Token({
  symbol,
  balance,
  noIcon
}: {
  symbol: string
  balance: string
  noIcon?: boolean
}): ReactElement {
  return (
    <div className={styles.token}>
      <figure
        className={`${styles.icon} ${symbol} ${noIcon ? styles.noIcon : ''}`}
      >
        <Logo />
      </figure>
      <PriceUnit price={balance} symbol={symbol} small />
    </div>
  )
}
