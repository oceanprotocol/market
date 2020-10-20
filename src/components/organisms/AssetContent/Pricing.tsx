import React, { FormEvent, ReactElement, useState } from 'react'
import { Formik } from 'formik'
import { initialValues, validationSchema } from '../../../models/FormPricing'
import { DDO } from '@oceanprotocol/lib'
import { usePricing } from '@oceanprotocol/react'
import { PriceOptionsMarket } from '../../../@types/MetaData'
import Alert from '../../atoms/Alert'
import styles from './Pricing.module.css'
import FormPricing from './FormPricing'

export default function Pricing({ ddo }: { ddo: DDO }): ReactElement {
  const { createPricing } = usePricing(ddo)
  const [showPricing, setShowPricing] = useState(false)

  async function handleCreatePricing(values: Partial<PriceOptionsMarket>) {
    const priceOptions = {
      ...values,
      // swapFee is tricky: to get 0.1% you need to send 0.001 as value
      swapFee: `${values.swapFee / 100}`
    }
    const tx = await createPricing(priceOptions)
  }

  return (
    <div className={styles.pricing}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await handleCreatePricing(values)
          setSubmitting(false)
        }}
      >
        {() =>
          showPricing ? (
            <FormPricing />
          ) : (
            <Alert
              state="info"
              title="No Price Created"
              text="This data set has no price yet. As the publisher you can create a fixed price, or a dynamic price for it. Onwards!"
              action={{
                name: 'Create Pricing',
                handleAction: (e: FormEvent<HTMLButtonElement>) => {
                  e.preventDefault()
                  setShowPricing(true)
                }
              }}
            />
          )
        }
      </Formik>
    </div>
  )
}
