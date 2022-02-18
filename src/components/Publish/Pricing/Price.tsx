import Conversion from '@shared/Price/Conversion'
import { Field, useField, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import Input from '@shared/FormInput'
import Error from './Error'
import PriceUnit from '@shared/Price/PriceUnit'
import styles from './Price.module.css'
import { FormPublishData } from '../_types'
import { getFieldContent } from '../_utils'

export default function Price({
  firstPrice,
  content
}: {
  firstPrice?: string
  content?: any
}): ReactElement {
  const [field, meta] = useField('pricing.price')
  const [checkbox] = useField('pricing.freeAgreement')

  const { values } = useFormikContext<FormPublishData>()
  const { dataTokenOptions } = values.services[0]

  return (
    <div className={styles.price}>
      {values.pricing.type === 'free' ? (
        <div className={styles.free}>
          <Input
            {...getFieldContent('freeAgreement', content.fields)}
            {...checkbox}
          />
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            <div className={styles.form}>
              <Input type="number" prefix="OCEAN" {...field} />
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
        </>
      )}
    </div>
  )
}
