import Loader from '../../../atoms/Loader'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import React, { ReactElement } from 'react'
import styles from './Feedback.module.css'
import Button from '../../../atoms/Button'

export default function Feedback({
  success,
  pricingStepText
}: {
  success: string
  pricingStepText: string
}): ReactElement {
  const SuccessAction = () => (
    <Button
      style="primary"
      size="small"
      className={styles.action}
      onClick={() => window?.location.reload()}
    >
      Reload Page
    </Button>
  )

  return (
    <div className={styles.feedback}>
      {success ? (
        <SuccessConfetti success={success} action={<SuccessAction />} />
      ) : (
        <Loader message={pricingStepText} />
      )}
    </div>
  )
}
