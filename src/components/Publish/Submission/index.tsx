import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { Feedback } from './Feedback'

export default function Submission(): ReactElement {
  return (
    <div className={styles.submission}>
      <Feedback />
    </div>
  )
}
