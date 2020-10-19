import React, { ReactElement, useState, useEffect } from 'react'
import { Field, FieldInputProps, Formik } from 'formik'
import Input from '../../atoms/Input'
import { FormPricing } from 'models/FormPricing'

export default function Pricing(): ReactElement {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handlePricing(values.amount, resetForm)
        setSubmitting(false)
      }}
    >
      {({
        values,
        touched,
        setTouched,
        isSubmitting,
        setFieldValue,
        submitForm,
        handleChange
      }) => (
        <>
          <Field name="price">
            {({
              field,
              form
            }: {
              field: FieldInputProps<FormPricing>
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
