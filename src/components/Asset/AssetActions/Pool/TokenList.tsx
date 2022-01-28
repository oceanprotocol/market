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
  poolShares,
  conversion,
  highlight,
  showTVLLabel
}: {
  title: string | ReactNode
  children: ReactNode
  baseTokenValue: string
  baseTokenSymbol: string
  datatokenValue: string
  datatokenSymbol: string
  poolShares: string
  conversion: Decimal
  highlight?: boolean
  showTVLLabel?: boolean
}): ReactElement {
  return (
    <div className={`${styles.tokenlist} ${highlight ? styles.highlight : ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tokens}>
        <div>
          <Token symbol={baseTokenSymbol} balance={baseTokenValue} />
          <Token symbol={datatokenSymbol} balance={datatokenValue} />
          {conversion.greaterThan(0) && (
            <Conversion
              price={conversion.toString()}
              className={styles.totalLiquidity}
              showTVLLabel={showTVLLabel}
            />
          )}
        </div>

        <div>
          <Token symbol="pool shares" balance={poolShares} noIcon />
          {children}
        </div>
      </div>
    </div>
  )
}
