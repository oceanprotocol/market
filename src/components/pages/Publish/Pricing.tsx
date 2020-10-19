import React, { ReactElement } from 'react'
import { Field, FieldInputProps, Formik } from 'formik'
import Input from '../../atoms/Input'
import { initialValues, validationSchema } from 'models/FormPricing'
import { DDO } from '@oceanprotocol/lib'
import { usePricing } from '@oceanprotocol/react'
import { PriceOptionsMarket } from '../../../@types/MetaData'

export default function Pricing({ ddo }: { ddo: DDO }): ReactElement {
  const { createPricing } = usePricing(ddo)

  async function handleCreatePricing(values: Partial<PriceOptionsMarket>) {
    const priceOptions = {
      price: values.price,
      tokensToMint: values.tokensToMint,
      type: values.type,
      weightOnDataToken: values.weightOnDataToken,
      swapFee: values.swapFee
    }
    const tx = await createPricing(priceOptions)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleCreatePricing(values)
        setSubmitting(false)
      }}
    >
      {() => (
        <>
          <Field name="price">
            {({
              field,
              form
            }: {
              field: FieldInputProps<PriceOptionsMarket>
              form: any
            }) => (
              <Input
                type="price"
                name="price"
                label="Price"
                field={field}
                form={form}
              />
            )}
          </Field>
        </>
      )}
    </Formik>
  )
}
