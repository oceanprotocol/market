import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'

export default function Submission(): ReactElement {
  const { values, handleSubmit } = useFormikContext<FormPublishData>()

  return (
    <div className={styles.submission}>
      <h3>Submission</h3>
      Place to teach about what happens next, output all the steps in background
      in some list, after submission continously update this list with the
      status of the submission.
    </div>
  )
}
