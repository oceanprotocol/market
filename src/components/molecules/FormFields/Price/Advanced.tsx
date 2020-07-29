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
import { useOcean } from '@oceanprotocol/react'

export default function Advanced(props: InputProps): ReactElement {
  const { price } = props.form.values as MetadataPublishForm
  const { balance } = useOcean()

  const cost = '1'
  const weightOnDataToken = '90' // in %

  const [ocean, setOcean] = useState('10')
  const tokensToMint = Number(ocean) * (Number(weightOnDataToken) / 10)

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
          <Wallet />
        </aside>

        <table className={styles.tokens}>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Weight</th>
              <th>Amount</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OCEAN</td>
              <td>{`${100 - Number(weightOnDataToken)}%`}</td>
              <td>
                <InputElement
                  value={ocean}
                  name="ocean"
                  type="number"
                  onChange={handleOceanChange}
                />
              </td>
              <td>
                <Conversion price={ocean} />
              </td>
            </tr>
            <tr>
              <td>OCEAN-CAVIAR</td>
              <td>{`${weightOnDataToken}%`}</td>
              <td>
                <InputElement
                  {...props.field}
                  value={tokensToMint.toString()}
                  name="price.tokensToMint"
                  type="number"
                  readOnly
                />
              </td>
              <td />
            </tr>
          </tbody>
        </table>
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
