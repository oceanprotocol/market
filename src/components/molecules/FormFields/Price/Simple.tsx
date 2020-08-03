import React, { ReactElement, ChangeEvent } from 'react'
import stylesIndex from './index.module.css'
import styles from './Simple.module.css'
import FormHelp from '../../../atoms/Input/Help'
import Label from '../../../atoms/Input/Label'
import InputElement from '../../../atoms/Input/InputElement'
import Conversion from '../../../atoms/Price/Conversion'

export default function Simple({
  ocean,
  onChange
}: {
  ocean: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}): ReactElement {
  return (
    <div className={stylesIndex.content}>
      <div className={styles.simple}>
        <FormHelp className={stylesIndex.help}>
          Set your price for accessing this data set. A Data Token contract for
          this data set, worth the entered amount of OCEAN will be created.
        </FormHelp>

        <form className={styles.form}>
          <Label htmlFor="ocean">Ocean Tokens</Label>

          <InputElement
            value={ocean}
            name="ocean"
            type="number"
            prefix="OCEAN"
            onChange={onChange}
          />

          <Conversion price={ocean} className={stylesIndex.conversion} />
        </form>
      </div>
    </div>
  )
}
