import React, { ReactElement, useState } from 'react'
import { Form, Formik } from 'formik'
import { Assets } from './Assets'
import styles from './index.module.css'
import { initialSettingsAssets, initialValues } from '../_constants'
import { validationSchema } from '../_validation'

export default function PublisherSignalsTab(): ReactElement {
  const [assets, setAssets] = useState(initialSettingsAssets)

  return (
    <div className={styles.submission}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false)
          }, 1000)
        }}
      >
        <Form>
          <Assets assets={assets} />
        </Form>
      </Formik>
    </div>
  )
}
