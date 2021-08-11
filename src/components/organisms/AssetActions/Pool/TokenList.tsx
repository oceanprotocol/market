import Conversion from '../../../atoms/Price/Conversion'
import React, { ReactElement, ReactNode } from 'react'
import Token from './Token'
import styles from './TokenList.module.css'

export default function TokenList({
  title,
  children,
  ocean,
  oceanSymbol,
  dt,
  dtSymbol,
  poolShares,
  conversion,
  highlight,
  showTVLLabel
}: {
  title: string | ReactNode
  children: ReactNode
  ocean: string
  oceanSymbol: string
  dt: string
  dtSymbol: string
  poolShares: string
  conversion: number
  highlight?: boolean
  showTVLLabel?: boolean
}): ReactElement {
  return (
    <div className={`${styles.tokenlist} ${highlight ? styles.highlight : ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tokens}>
        <div>
          <Token symbol={oceanSymbol} balance={ocean} />
          <Token symbol={dtSymbol} balance={dt} />
          {conversion > 0 && (
            <Conversion
              price={`${conversion}`}
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
