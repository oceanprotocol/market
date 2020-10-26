import { usePricing } from '@oceanprotocol/react'
import Conversion from '../../../../atoms/Price/Conversion'
import { useField } from 'formik'
import React, { ReactElement } from 'react'
import Input from '../../../../atoms/Input'
import styles from './Price.module.css'
import Error from './Error'
import { DDO } from '@oceanprotocol/lib'
import PriceUnit from '../../../../atoms/Price/PriceUnit'

export default function Price({
  ddo,
  firstPrice
}: {
  ddo: DDO
  firstPrice?: string
}): ReactElement {
  const [field, meta] = useField('price')
  const { dtName, dtSymbol } = usePricing(ddo)

  return (
    <div className={styles.price}>
      <div className={styles.grid}>
        <div className={styles.form}>
          <Input
            value={field.value}
            name="price"
            type="number"
            prefix="OCEAN"
            min="1"
            {...field}
            additionalComponent={
              <Conversion price={field.value} className={styles.conversion} />
            }
          />
          <Error meta={meta} />
        </div>
        <div className={styles.datatoken}>
          <h4>
            = <strong>1</strong> {dtName} — {dtSymbol}
          </h4>
        </div>
      </div>
      {firstPrice && (
        <aside className={styles.firstPrice}>
          Expected first price:{' '}
          <PriceUnit
            price={Number(firstPrice) > 0 ? firstPrice : '-'}
            small
            conversion
          />
        </aside>
      )}
    </div>
  )
}
