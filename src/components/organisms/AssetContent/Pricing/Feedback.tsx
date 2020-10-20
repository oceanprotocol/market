import Loader from '../../../atoms/Loader'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import React, { ReactElement } from 'react'
import styles from './Feedback.module.css'

export default function Feedback({
  success,
  pricingStepText
}: {
  success: string
  pricingStepText: string
}): ReactElement {
  return (
    <div className={styles.feedback}>
      {success ? (
        <SuccessConfetti success={success} />
      ) : (
        <Loader message={pricingStepText} />
      )}
    </div>
  )
}
