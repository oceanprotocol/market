import Conversion from '../../../atoms/Price/Conversion'
import React, { ReactElement, ReactNode } from 'react'
import Token from './Token'
import styles from './TokenList.module.css'

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
  conversion: number
  highlight?: boolean
}): ReactElement {
  return (
    <div className={`${styles.tokeninfo} ${highlight ? styles.highlight : ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tokens}>
        <Token symbol="OCEAN" balance={ocean} />
        <Token symbol={dtSymbol} balance={dt} />
        <Token symbol="pool shares" balance={poolShares} noIcon />

        {children}

        {conversion > 0 && (
          <Conversion
            price={`${conversion}`}
            className={styles.totalLiquidity}
          />
        )}
      </div>
    </div>
  )
}
