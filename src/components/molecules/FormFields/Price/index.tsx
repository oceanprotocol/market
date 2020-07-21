import React, { ReactElement } from 'react'
import { InputProps } from '../../../atoms/Input'
import InputElement from '../../../atoms/Input/InputElement'
import styles from './index.module.css'
import Label from '../../../atoms/Input/Label'
import { useFormikContext } from 'formik'
import { MetadataPublishForm } from '../../../../@types/MetaData'

export default function Price(props: InputProps): ReactElement {
  const { values } = useFormikContext()

  return (
    <div className={styles.price}>
      <div>
        <Label htmlFor="price.cost">Cost</Label>
        <InputElement
          {...props.field}
          value={(values as MetadataPublishForm).price.cost}
          name="price.cost"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="price.tokensToMint">Tokens to Mint</Label>
        <InputElement
          {...props.field}
          value={(values as MetadataPublishForm).price.tokensToMint}
          name="price.tokensToMint"
          type="number"
        />
      </div>
    </div>
  )
}
