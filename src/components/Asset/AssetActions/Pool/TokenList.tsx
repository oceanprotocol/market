import Conversion from '@shared/Price/Conversion'
import React, { ReactElement, ReactNode } from 'react'
import Token from './Token'
import styles from './TokenList.module.css'
import Decimal from 'decimal.js'

export default function TokenList({
  title,
  children,
  baseTokenValue,
  baseTokenSymbol,
  datatokenValue,
  datatokenSymbol,
  conversion,
  highlight,
  size = 'small'
}: {
  title?: string | ReactNode
  children?: ReactNode
  baseTokenValue: string
  baseTokenSymbol: string
  datatokenValue?: string
  datatokenSymbol?: string
  conversion?: Decimal
  highlight?: boolean
  size?: 'small' | 'mini'
}): ReactElement {
  return (
    <div className={`${styles.tokenlist} ${highlight ? styles.highlight : ''}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.tokens}>
        <Token symbol={baseTokenSymbol} balance={baseTokenValue} size={size} />

        {conversion?.greaterThan(0) && (
          <Conversion
            price={conversion.toString()}
            className={styles.totalLiquidity}
          />
        )}
        {datatokenValue && (
          <Token
            symbol={datatokenSymbol}
            balance={datatokenValue}
            size={size}
          />
        )}
        {children}
      </div>
    </div>
  )
}
