import React, { ReactElement, useState } from 'react'
import { Form, Formik } from 'formik'
import { Assets } from './Assets'
import { Custom } from './Custom'

import styles from './index.module.css'
import { initialSettingsAssets, initialValues } from '../_constants'
import { validationSchema } from '../_validation'

export default function AssetSignalsTab(): ReactElement {
  // This `feedback` state is auto-synced into Formik context under `values.feedback`
  // for use in other components. Syncing defined in ./Steps.tsx child component.
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
          <Custom assets={assets} />
        </Form>
      </Formik>
    </div>
  )
}
