import React, { ReactElement } from 'react'
import stylesIndex from './index.module.css'
import styles from './Coin.module.css'
import InputElement from '@shared/Form/Input/InputElement'
import Logo from '@images/logo.svg'
import Conversion from '@shared/Price/Conversion'
import { DataTokenOptions } from '@hooks/usePublish'
import { useField } from 'formik'
import Error from './Error'

export default function Coin({
  datatokenOptions,
  name,
  weight,
  readOnly
}: {
  datatokenOptions: DataTokenOptions
  name: string
  weight: string
  readOnly?: boolean
}): ReactElement {
  const [field, meta] = useField(name)

  return (
    <div className={styles.coin}>
      <figure className={styles.icon}>
        <Logo />
      </figure>

      <h4 className={styles.tokenName}>
        {datatokenOptions?.name || 'Data Token'}
      </h4>

      <div className={styles.weight}>
        Weight <strong>{weight}</strong>
      </div>

      <div className={styles.data}>
        <InputElement
          type="number"
          readOnly={readOnly}
          prefix={datatokenOptions?.symbol || 'DT'}
          min="1"
          name={name}
          value={field.value}
          {...field}
        />
        {datatokenOptions?.symbol === 'OCEAN' && (
          <Conversion price={field.value} className={stylesIndex.conversion} />
        )}
        <Error meta={meta} />
      </div>
    </div>
  )
}
