import React, { ReactElement } from 'react'
import InputElement from '../../../../atoms/Input/InputElement'
import { ReactComponent as Logo } from '../../../../../images/logo.svg'
import Conversion from '../../../../atoms/Price/Conversion'
import { DataTokenOptions } from '../../../../../hooks/usePublish'
import { useField } from 'formik'
import Error from './Error'
import { conversion } from './index.module.css'
import {
  coin,
  icon,
  tokenName,
  weight as weightStyle,
  data
} from './Coin.module.css'

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
    <div className={coin}>
      <figure className={icon}>
        <Logo />
      </figure>

      <h4 className={tokenName}>{datatokenOptions?.name || 'Data Token'}</h4>

      <div className={weightStyle}>
        Weight <strong>{weight}</strong>
      </div>

      <div className={data}>
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
          <Conversion price={field.value} className={conversion} />
        )}
        <Error meta={meta} />
      </div>
    </div>
  )
}
