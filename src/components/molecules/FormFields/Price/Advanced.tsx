import React, { ReactElement, useState, ChangeEvent } from 'react'
import { InputProps } from '../../../atoms/Input'
import InputElement from '../../../atoms/Input/InputElement'
import stylesIndex from './index.module.css'
import styles from './Advanced.module.css'
import Label from '../../../atoms/Input/Label'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import Cost from './Cost'
import Conversion from '../../../atoms/Price/Conversion'
import FormHelp from '../../../atoms/Input/Help'

export default function Advanced(props: InputProps): ReactElement {
  const { price } = props.form.values as MetadataPublishForm
  const [weight, setWeight] = useState('10')

  const liquidity = (price.cost * Number(weight)).toString()

  function handleWeightChange(event: ChangeEvent<HTMLInputElement>) {
    setWeight(event.target.value)
  }

  return (
    <div className={stylesIndex.content}>
      <div className={styles.advanced}>
        <FormHelp className={stylesIndex.help}>
          Set your price for accessing this data set. A Data Token for this data
          set worth the entered amount of OCEAN, and a Data Token/OCEAN
          liquidity pool will be created with Balancer.
        </FormHelp>

        <div>
          <Cost {...props} />
          <div>
            <Label htmlFor="weight">Weight on Data Token</Label>
            <InputElement
              value={weight}
              name="weight"
              type="number"
              onChange={handleWeightChange}
              step="10"
              postfix="%"
            />
          </div>
          <div className={styles.liquidity}>
            <Label htmlFor="liquidity">Liquidity</Label>
            <InputElement
              value={liquidity}
              name="liquidity"
              readOnly
              prefix="OCEAN"
            />
            <Conversion price={liquidity} className={stylesIndex.conversion} />
          </div>
          <div>
            <Label htmlFor="price.tokensToMint">Tokens to Mint</Label>
            <InputElement
              {...props.field}
              value={(price && price.tokensToMint) || 1}
              name="price.tokensToMint"
              type="number"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  )
}
