import React, { ReactElement } from 'react'
import styles from './Coin.module.css'
import InputElement from '@shared/FormInput/InputElement'
import Logo from '@images/logo.svg'
import Conversion from '@shared/Price/Conversion'
import { useField } from 'formik'
import Error from '@shared/FormInput/Error'

export default function Coin({
  datatokenOptions,
  name,
  weight,
  readOnly
}: {
  datatokenOptions: { name: string; symbol: string }
  name: string
  weight: string
  readOnly?: boolean
}): ReactElement {
  const [field, meta] = useField(`pricing.${name}`)

  return (
    <div className={styles.coin}>
      <div className={styles.token}>
        <figure className={styles.icon}>
          <Logo />
        </figure>
        <div>
          <h4 className={styles.tokenName}>
            {datatokenOptions?.name || 'Data Token'}
          </h4>

          <div className={styles.weight}>
            Weight <strong>{weight}</strong>
          </div>
        </div>
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
          <Conversion price={field.value} />
        )}
        <div>
          <Error meta={meta} />
        </div>
      </div>
    </div>
  )
}
