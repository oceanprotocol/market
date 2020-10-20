import React, { ReactElement, useState } from 'react'
import { Field, FieldInputProps, Formik } from 'formik'
import Input from '../../atoms/Input'
import { initialValues, validationSchema } from '../../../models/FormPricing'
import { DDO } from '@oceanprotocol/lib'
import { usePricing } from '@oceanprotocol/react'
import { PriceOptionsMarket } from '../../../@types/MetaData'
import Alert from '../../atoms/Alert'
import styles from './Pricing.module.css'
import Price from './Price'

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
      {showPricing ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await handleCreatePricing(values)
            setSubmitting(false)
          }}
        >
          {(props) => <Price name="price" {...props} />}
        </Formik>
      ) : (
        <Alert
          state="info"
          title="No Price Created"
          text="This data set has no price yet. As the publisher you can create a fixed price, or a dynamic price for it."
          action={{
            name: 'Create Pricing',
            handleAction: () => setShowPricing(true)
          }}
        />
      )}
    </div>
  )
}
