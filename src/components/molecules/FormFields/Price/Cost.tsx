import React, { ReactElement } from 'react'
import InputElement from '../../../atoms/Input/InputElement'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import Conversion from '../../../atoms/Price/Conversion'
import { InputProps } from '../../../atoms/Input'
import Label from '../../../atoms/Input/Label'
import stylesIndex from './index.module.css'

export default function Cost(props: InputProps): ReactElement {
  const { price } = props.form.values as MetadataPublishForm

  return (
    <div>
      <Label htmlFor="price.cost">Cost</Label>

      <InputElement
        {...props.field}
        value={(price && price.cost) || 0}
        name="price.cost"
        type="number"
        prefix="OCEAN"
      />

      <Conversion
        price={price.cost.toString()}
        className={stylesIndex.conversion}
      />
    </div>
  )
}
