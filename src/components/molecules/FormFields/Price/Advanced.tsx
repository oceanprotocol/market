import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react'
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
import { useOcean } from '@oceanprotocol/react'
import Alert from '../../../atoms/Alert'
import Coin from './Coin'

export default function Advanced(props: InputProps): ReactElement {
  const { price } = props.form.values as MetadataPublishForm
  const { balance } = useOcean()

  const cost = '1'
  const weightOnDataToken = '90' // in %

  const [ocean, setOcean] = useState('10')
  const tokensToMint = Number(ocean) * (Number(weightOnDataToken) / 10)

  const [error, setError] = useState<string>()

  useEffect(() => {
    if (balance.ocean < ocean) {
      setError(`Insufficiant balance. You need at least ${ocean} OCEAN`)
    } else {
      setError(undefined)
    }
  }, [ocean])

  function handleOceanChange(event: ChangeEvent<HTMLInputElement>) {
    setOcean(event.target.value)
  }

  return (
    <div className={stylesIndex.content}>
      <div className={styles.advanced}>
        <FormHelp className={stylesIndex.help}>
          {`Let's create a decentralized, automated market for your data set. A Data Token contract for this data set worth the entered amount of OCEAN will be created. Additionally, you will provide liquidity into a Data Token/OCEAN
          liquidity pool with Balancer.`}
        </FormHelp>

        <aside className={styles.wallet}>
          {balance && balance.ocean && (
            <div className={styles.balance}>
              OCEAN <strong>{balance.ocean}</strong>
            </div>
          )}
          <Wallet />
        </aside>

        <h4 className={styles.title}>Data Token Liquidity Pool</h4>

        <div className={styles.tokens}>
          <Coin
            name="ocean"
            symbol="OCEAN"
            value={ocean}
            weight={`${100 - Number(weightOnDataToken)}%`}
            onChange={handleOceanChange}
          />
          <Coin
            name="price.tokensToMint"
            symbol="OCEAN-CAV"
            value={tokensToMint.toString()}
            weight={`${weightOnDataToken}%`}
            readOnly
            field={props.field}
          />
        </div>

        {error && <Alert text={error} state="error" />}
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
