import React, { ReactElement } from 'react'
import InputElement from '../../../atoms/Input/InputElement'
import styles from './Cost.module.css'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import Conversion from '../../../atoms/Price/Conversion'
import { InputProps } from '../../../atoms/Input'
import Label from '../../../atoms/Input/Label'

export default function Cost(props: InputProps): ReactElement {
  const { price } = props.form.values as MetadataPublishForm

  return (
    <div className={styles.cost}>
      <Label htmlFor="price.cost">Cost</Label>

      <div className={styles.prefix}>OCEAN</div>
      <InputElement
        {...props.field}
        value={(price && price.cost) || 0}
        name="price.cost"
        type="number"
      />
      <Conversion price={price.cost.toString()} />
    </div>
  )
}
