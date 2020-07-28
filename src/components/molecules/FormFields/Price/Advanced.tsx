import React, { ReactElement } from 'react'
import { InputProps } from '../../../atoms/Input'
import InputElement from '../../../atoms/Input/InputElement'
import stylesIndex from './index.module.css'
import styles from './Advanced.module.css'
import Label from '../../../atoms/Input/Label'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import Cost from './Cost'

export default function Advanced(props: InputProps): ReactElement {
  const { price } = props.form.values as MetadataPublishForm

  return (
    <div className={`${stylesIndex.content} ${styles.advancedInput}`}>
      <Cost {...props} />
      <div>
        <Label htmlFor="price.tokensToMint">Tokens to Mint</Label>
        <InputElement
          {...props.field}
          value={(price && price.tokensToMint) || 1}
          name="price.tokensToMint"
          type="number"
        />
      </div>
    </div>
  )
}
