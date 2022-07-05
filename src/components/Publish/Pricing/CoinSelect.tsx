import Input from '@shared/FormInput'
import React, { ReactElement } from 'react'
import styles from './CoinSelect.module.css'

export default function CoinSelect({
  approvedBaseTokens,
  dtSymbol,
  disabled
}: //   setCoin
{
  approvedBaseTokens: TokenInfo[]
  dtSymbol: string
  disabled: boolean
  //   setCoin: (coin: string) => void
}): ReactElement {
  const options = approvedBaseTokens?.map((token) => token.symbol)

  return (
    approvedBaseTokens?.length > 0 && (
      <div className={styles.container}>
        <Input className={styles.coinSelect} type="select" options={options} />
      </div>
    )
    // <select
    //   className={styles.coinSelect}
    //   //   onChange={(e) => setCoin(e.target.value)}
    //   disabled={disabled}
    // >
    //   <option className={styles.option} value="OCEAN">
    //     OCEAN
    //   </option>
    //   <option className={styles.option} value={dtSymbol}>
    //     {dtSymbol}
    //   </option>
    // </select>
  )
}
