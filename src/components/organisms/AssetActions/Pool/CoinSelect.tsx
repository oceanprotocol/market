import React, { ReactElement } from 'react'
import styles from './CoinSelect.module.css'

export default function CoinSelect({
  dtSymbol,
  setCoin
}: {
  dtSymbol: string
  setCoin: (coin: string) => void
}): ReactElement {
  return (
    <select
      className={styles.coinSelect}
      onChange={(e) => setCoin(e.target.value)}
    >
      <option className={styles.option} value="OCEAN">
        OCEAN
      </option>
      <option className={styles.option} value={dtSymbol}>
        {dtSymbol}
      </option>
    </select>
  )
}
