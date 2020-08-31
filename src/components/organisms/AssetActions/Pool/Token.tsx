import React, { ReactElement } from 'react'
import styles from './Token.module.css'
import { ReactComponent as Logo } from '../../../../images/logo.svg'
import PriceUnit from '../../../atoms/Price/PriceUnit'

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
      <PriceUnit price={balance} symbol={symbol} small />
    </div>
  )
}
