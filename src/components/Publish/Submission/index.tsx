import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import { Feedback } from './Feedback'

export default function Submission(): ReactElement {
  const { values, handleSubmit } = useFormikContext<FormPublishData>()

  return (
    <div className={styles.submission}>
      <h3>Submission</h3>

      <Feedback />
    </div>
  )
}
