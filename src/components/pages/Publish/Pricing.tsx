import React, { ReactElement } from 'react'
import { Field, FieldInputProps, Formik } from 'formik'
import Input from '../../atoms/Input'
import { initialValues, validationSchema } from '../../../models/FormPricing'
import { DDO } from '@oceanprotocol/lib'
import { usePricing } from '@oceanprotocol/react'
import { PriceOptionsMarket } from '../../../@types/MetaData'
import ddoFixture from '../../../../tests/unit/__fixtures__/ddo'

export default function Pricing({ ddo }: { ddo: DDO }): ReactElement {
  const { createPricing } = usePricing(ddoFixture)

  async function handleCreatePricing(values: Partial<PriceOptionsMarket>) {
    const priceOptions = {
      ...values,
      // swapFee is tricky: to get 0.1% you need to send 0.001 as value
      swapFee: `${values.swapFee / 100}`
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
