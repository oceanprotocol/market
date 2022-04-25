import React, { ReactElement } from 'react'
import styles from './index.module.css'
import PriceUnit from '@shared/Price/PriceUnit'
import Logo from '@shared/atoms/Logo'
import Conversion from '@shared/Price/Conversion'

export default function Token({
  symbol,
  balance,
  conversion,
  noIcon,
  size
}: {
  symbol: string
  balance: string
  conversion?: boolean
  noIcon?: boolean
  size?: 'small' | 'mini'
}): ReactElement {
  return (
    <>
      <div className={`${styles.token} ${size ? styles[size] : ''}`}>
        <figure
          className={`${styles.icon} ${symbol} ${noIcon ? styles.noIcon : ''}`}
        >
          <Logo noWordmark />
        </figure>
        <PriceUnit price={balance} symbol={symbol} size={size} />
      </div>
      {conversion && (
        <Conversion price={balance} className={`${styles.conversion}`} />
      )}
    </>
  )
}
