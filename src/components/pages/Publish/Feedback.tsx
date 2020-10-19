import Alert from '../../atoms/Alert'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'
import React, { ReactElement } from 'react'
import styles from './Feedback.module.css'
import SuccessConfetti from '../../atoms/SuccessConfetti'
import { DDO } from '@oceanprotocol/lib'
import Pricing from './Pricing'

export default function Feedback({
  error,
  success,
  ddo,
  publishStepText,
  isPricing,
  setError
}: {
  error: string
  success: string
  ddo: DDO
  publishStepText: string
  isPricing: boolean
  setError: (error: string) => void
}): ReactElement {
  const SuccessAction = () => (
    <Button
      style="primary"
      size="small"
      href={`/asset/${ddo.id}`}
      className={styles.action}
    >
      Go to data set →
    </Button>
  )

  return (
    <div className={styles.feedback}>
      <div className={styles.box}>
        <h3>Publishing Data Set</h3>
        {error ? (
          <>
            <Alert text={error} state="error" />
            <Button
              style="primary"
              size="small"
              className={styles.action}
              onClick={() => setError(undefined)}
            >
              Try Again
            </Button>
          </>
        ) : isPricing ? (
          <Pricing ddo={ddo} />
        ) : success ? (
          <SuccessConfetti success={success} action={<SuccessAction />} />
        ) : (
          <Loader message={publishStepText} />
        )}
      </div>
    </div>
  )
}
