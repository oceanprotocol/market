import Conversion from '@shared/Price/Conversion'
import { useField, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import Input from '@shared/FormInput'
import Error from './Error'
import PriceUnit from '@shared/Price/PriceUnit'
import styles from './Price.module.css'
import { FormPublishData } from '../_types'

export default function Price({
  firstPrice
}: {
  firstPrice?: string
}): ReactElement {
  const [field, meta] = useField('pricing.price')

  const { values } = useFormikContext<FormPublishData>()
  const { dataTokenOptions } = values.services[0]

  return (
    <div className={styles.price}>
      <div className={styles.grid}>
        <div className={styles.form}>
          {field.value === 0 ? (
            <Input
              value="0"
              name="pricing.price"
              type="number"
              prefix="OCEAN"
              readOnly
            />
          ) : (
            <Input
              value={field.value}
              name="pricing.price"
              type="number"
              prefix="OCEAN"
              {...field}
            />
          )}
          <Error meta={meta} />
        </div>
        <div className={styles.datatoken}>
          <h4>
            = <strong>1</strong> {dataTokenOptions.symbol}{' '}
            <Conversion price={field.value} className={styles.conversion} />
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
