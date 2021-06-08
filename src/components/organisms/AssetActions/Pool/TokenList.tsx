import Conversion from '../../../atoms/Price/Conversion'
import React, { ReactElement, ReactNode } from 'react'
import Token from './Token'
import styles from './TokenList.module.css'
import Decimal from 'decimal.js'

export default function TokenList({
  title,
  children,
  ocean,
  dt,
  dtSymbol,
  poolShares,
  conversion,
  highlight
}: {
  title: string | ReactNode
  children: ReactNode
  ocean: string
  dt: string
  dtSymbol: string
  poolShares: string
  conversion: Decimal
  highlight?: boolean
}): ReactElement {
  return (
    <div className={`${styles.tokenlist} ${highlight ? styles.highlight : ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tokens}>
        <div>
          <Token symbol="OCEAN" balance={ocean} />
          <Token symbol={dtSymbol} balance={dt} />
          {conversion.greaterThan(0) && (
            <Conversion
              price={`${conversion.toString()}`}
              className={styles.totalLiquidity}
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
