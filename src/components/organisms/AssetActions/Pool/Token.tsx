import React, { ReactElement } from 'react'
import * as styles from './Token.module.css'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Logo from '../../../atoms/Logo'

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
        <Logo noWordmark />
      </figure>
      <PriceUnit price={balance} symbol={symbol} small />
    </div>
  )
}
