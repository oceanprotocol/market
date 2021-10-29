import React, { ReactElement } from 'react'
import { useFormikContext, Form, FormikContextType } from 'formik'
import FormActions from './FormActions'
import { FormPublishData } from '../_types'
import styles from './index.module.css'
import PricingFields from './Pricing'
import Debug from '../Debug'
import MetadataFields from './Metadata'
import ServicesFields from './Services'
import content from '../../../../content/publish/form.json'
import Preview from './Preview'

function Steps({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <MetadataFields />
    case 2:
      return <ServicesFields />
    case 3:
      return <PricingFields />
    case 4:
      return <Preview />
    default:
  }
}

export default function FormPublish(): ReactElement {
  const { isValid, values, resetForm }: FormikContextType<FormPublishData> =
    useFormikContext()

  // reset form validation on every mount
  // useEffect(() => {
  //   setErrors({})
  //   setTouched({})

  //   // setSubmitting(false)
  // }, [setErrors, setTouched])

  return (
    <>
      <Form className={styles.form}>
        <Steps step={values.step} />
        <FormActions step={values.step} />
      </Form>
      <Debug values={values} />
    </>
  )
}
