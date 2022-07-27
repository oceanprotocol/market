import Conversion from '@shared/Price/Conversion'
import { Field, useField, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import Input from '@shared/FormInput'
import Error from '@shared/FormInput/Error'
import styles from './Price.module.css'
import { FormPublishData } from '../_types'
import { getFieldContent } from '@utils/form'

export default function Price({ content }: { content?: any }): ReactElement {
  const [field, meta] = useField('pricing.price')

  const { values } = useFormikContext<FormPublishData>()
  const { dataTokenOptions } = values.services[0]

  const classNames = `${styles.price} ${
    values.pricing.type === 'free' ? styles.free : styles.fixed
  }`

  return (
    <div className={classNames}>
      {values.pricing.type === 'free' ? (
        <Field
          {...getFieldContent('freeAgreement', content.fields)}
          component={Input}
          name="pricing.freeAgreement"
        />
      ) : (
        <div className={styles.form}>
          <div className={styles.inputWrap}>
            <Input
              type="number"
              min="1"
              placeholder="0"
              prefix="OCEAN"
              {...field}
            />
            <Error meta={meta} />
          </div>

          <h4 className={styles.datatoken}>
            = <strong>1</strong> {dataTokenOptions.symbol}{' '}
            <Conversion price={field.value} className={styles.conversion} />
          </h4>
        </div>
      )}
    </div>
  )
}
