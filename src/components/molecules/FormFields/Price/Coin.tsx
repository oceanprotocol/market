import React, { ReactElement, ChangeEvent } from 'react'
import stylesIndex from './index.module.css'
import styles from './Coin.module.css'
import InputElement from '../../../atoms/Input/InputElement'
import { ReactComponent as Logo } from '../../../../images/logo.svg'
import Conversion from '../../../atoms/Price/Conversion'

export default function Coin({
  symbol,
  name,
  value,
  weight,
  onOceanChange,
  readOnly
}: {
  symbol: string
  name: string
  value: string
  weight: string
  onOceanChange?: (event: ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
}): ReactElement {
  return (
    <div className={styles.coin}>
      <figure className={styles.icon}>
        <Logo />
      </figure>

      <div className={styles.data}>
        <InputElement
          value={value}
          name={name}
          type="number"
          onChange={onOceanChange}
          readOnly={readOnly}
          prefix={symbol}
        />
        <Conversion price={value} className={stylesIndex.conversion} />

        <div className={styles.weight}>
          Weight <strong>{weight}</strong>
        </div>
      </div>
    </div>
  )
}
