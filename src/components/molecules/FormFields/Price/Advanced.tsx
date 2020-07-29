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
import Wallet from '../../Wallet'

export default function Advanced(props: InputProps): ReactElement {
  const { price } = props.form.values as MetadataPublishForm

  const cost = '1'
  const weight = '90' // in %

  const [ocean, setOcean] = useState('1')
  const tokensToMint = Number(ocean) * (Number(weight) / 100)

  function handleOceanChange(event: ChangeEvent<HTMLInputElement>) {
    setOcean(event.target.value)
  }

  return (
    <div className={stylesIndex.content}>
      <div className={styles.advanced}>
        <FormHelp className={stylesIndex.help}>
          Set your price for accessing this data set. A Data Token contract for
          this data set worth the entered amount of OCEAN, and a Data
          Token/OCEAN liquidity pool will be created with Balancer.
        </FormHelp>

        <aside className={styles.wallet}>
          <Wallet />
        </aside>

        <div>
          <div>
            <Label htmlFor="ocean">Ocean Tokens</Label>

            <InputElement
              value={ocean}
              name="ocean"
              type="number"
              prefix="OCEAN"
              onChange={handleOceanChange}
            />

            <Conversion price={ocean} className={stylesIndex.conversion} />
          </div>

          <div>
            <Label htmlFor="dt">Data Tokens</Label>
            <InputElement
              value={tokensToMint.toString()}
              name="dt"
              type="number"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="weight">Weight on Data Token</Label>
            <InputElement
              value="90"
              name="weight"
              step="10"
              postfix="%"
              readOnly
            />
          </div>

          <div className={styles.liquidity}>
            <Label htmlFor="liquidity">Liquidity to Provide</Label>
            <InputElement
              value={cost.toString()}
              name="liquidity"
              readOnly
              prefix="OCEAN"
            />
            <Conversion
              price={cost.toString()}
              className={stylesIndex.conversion}
            />
          </div>
        </div>
      </div>

      {/* Hidden to fields to actually collect form values for Formik state */}
      <input type="hidden" {...props.field} name="price.cost" value={cost} />
      <input
        type="hidden"
        {...props.field}
        name="price.tokensToMint"
        value={tokensToMint}
      />
    </div>
  )
}
