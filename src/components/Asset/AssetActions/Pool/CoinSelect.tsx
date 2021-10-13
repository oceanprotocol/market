import React, { ReactElement } from 'react'
import styles from './CoinSelect.module.css'

export default function CoinSelect({
  dtSymbol,
  disabled,
  setCoin
}: {
  dtSymbol: string
  disabled: boolean
  setCoin: (coin: string) => void
}): ReactElement {
  return (
    <select
      className={styles.coinSelect}
      onChange={(e) => setCoin(e.target.value)}
      disabled={disabled}
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
