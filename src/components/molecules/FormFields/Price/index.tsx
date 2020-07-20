import React, { ReactElement } from 'react'
import { InputProps } from '../../../atoms/Input'
import InputElement from '../../../atoms/Input/InputElement'
import styles from './index.module.css'
import Label from '../../../atoms/Input/Label'

export default function Price(props: InputProps): ReactElement {
  return (
    <div className={styles.price}>
      <div>
        <Label htmlFor="cost">Cost</Label>
        <InputElement {...props} type="number" />
      </div>
      <div>
        <Label htmlFor="tokensToMint">Tokens to Mint</Label>
        <InputElement name="tokensToMint" type="number" min="1" />
      </div>
    </div>
  )
}
