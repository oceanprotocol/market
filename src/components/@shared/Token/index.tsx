import React, { ReactElement } from 'react'
import styles from './index.module.css'
import PriceUnit from '@shared/Price/PriceUnit'
import Logo from '@shared/atoms/Logo'
import Decimal from 'decimal.js'
import Conversion from '@shared/Price/Conversion'
import { MAX_DECIMALS } from '@utils/constants'

export default function Token({
  symbol,
  balance,
  conversion,
  noIcon,
  size
}: {
  symbol: string
  balance: string
  conversion?: Decimal
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
      {conversion?.greaterThan(0) && (
        <Conversion
          price={conversion.toDecimalPlaces(MAX_DECIMALS).toString()}
          className={styles.conversion}
        />
      )}
    </>
  )
}
