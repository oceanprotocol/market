import Alert from '../../atoms/Alert'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'
import React, { ReactElement } from 'react'
import styles from './Feedback.module.css'
import SuccessConfetti from '../../atoms/SuccessConfetti'

export default function Feedback({
  error,
  success,
  did,
  publishStepText,
  setError
}: {
  error: string
  success: string
  did: string
  publishStepText: string
  setError: (error: string) => void
}): ReactElement {
  const SuccessAction = () => (
    <Button
      style="primary"
      size="small"
      href={`/asset/${did}`}
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
        ) : success ? (
          <SuccessConfetti success={success} action={<SuccessAction />} />
        ) : (
          <Loader message={publishStepText} />
        )}
      </div>
    </div>
  )
}
