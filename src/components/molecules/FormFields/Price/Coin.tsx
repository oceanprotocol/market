import React, { ReactElement, ChangeEvent } from 'react'
import stylesIndex from './index.module.css'
import styles from './Coin.module.css'
import InputElement from '../../../atoms/Input/InputElement'
import { ReactComponent as Logo } from '../../../../images/logo.svg'
import Conversion from '../../../atoms/Price/Conversion'
import { DataTokenOptions } from '@oceanprotocol/react'

export default function Coin({
  datatokenOptions,
  name,
  value,
  weight,
  onOceanChange,
  readOnly
}: {
  datatokenOptions: DataTokenOptions
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

      <h4 className={styles.tokenName}>
        {datatokenOptions?.name || 'Data Token'}
      </h4>

      <div className={styles.data}>
        <InputElement
          value={value}
          name={name}
          type="number"
          onChange={onOceanChange}
          readOnly={readOnly}
          prefix={datatokenOptions?.symbol || 'DT'}
        />
        <Conversion price={value} className={stylesIndex.conversion} />

        <div className={styles.weight}>
          Weight <strong>{weight}</strong>
        </div>
      </div>
    </div>
  )
}
