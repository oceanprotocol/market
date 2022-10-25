import Conversion from '@shared/Price/Conversion'
import { Field, useField, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import Input from '@shared/FormInput'
import Error from '@shared/FormInput/Error'
import styles from './Price.module.css'
import { FormPublishData } from '../_types'
import { getFieldContent } from '@utils/form'
import CoinSelect from './CoinSelect'

export default function Price({
  approvedBaseTokens,
  content
}: {
  approvedBaseTokens?: TokenInfo[]
  content?: any
}): ReactElement {
  const [field, meta] = useField('pricing.price')

  const { values } = useFormikContext<FormPublishData>()
  const { dataTokenOptions } = values.services[0]

  return (
    <div className={styles.price}>
      {values.pricing.type === 'free' ? (
        <div className={styles.free}>
          <Field
            {...getFieldContent('freeAgreement', content.fields)}
            component={Input}
            name="pricing.freeAgreement"
          />
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            <div className={styles.form}>
              <Input
                type="number"
                min="1"
                placeholder="0"
                prefix={
                  approvedBaseTokens?.length > 1 ? (
                    <CoinSelect approvedBaseTokens={approvedBaseTokens} />
                  ) : (
                    values.pricing?.baseToken?.symbol
                  )
                }
                {...field}
              />
              <Error meta={meta} />
            </div>
            <div className={styles.datatoken}>
              <h4>
                = <strong>1</strong> {dataTokenOptions.symbol}{' '}
                <Conversion
                  price={field.value}
                  symbol={values.pricing?.baseToken?.symbol}
                  className={styles.conversion}
                />
              </h4>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
