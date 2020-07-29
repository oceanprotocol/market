import React, { ReactElement, ChangeEvent } from 'react'
import stylesIndex from './index.module.css'
import styles from './Coin.module.css'
import InputElement from '../../../atoms/Input/InputElement'
import { ReactComponent as Logo } from '../../../../images/logo.svg'
import Conversion from '../../../atoms/Price/Conversion'
import Label from '../../../atoms/Input/Label'

export default function Coin({
  symbol,
  name,
  value,
  weight,
  onChange,
  readOnly
}: {
  symbol: string
  name: string
  value: string
  weight: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
  field?: any
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
          onChange={onChange}
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
