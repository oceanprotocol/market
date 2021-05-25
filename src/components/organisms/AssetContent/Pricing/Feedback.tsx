import Loader from '../../../atoms/Loader'
import SuccessConfetti from '../../../atoms/SuccessConfetti'
import React, { ReactElement } from 'react'
import Button from '../../../atoms/Button'
import { feedback } from './Feedback.module.css'

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
      onClick={() => window?.location.reload()}
    >
      Reload Page
    </Button>
  )

  return (
    <div className={feedback}>
      {success ? (
        <SuccessConfetti success={success} action={<SuccessAction />} />
      ) : (
        <Loader message={pricingStepText} />
      )}
    </div>
  )
}
