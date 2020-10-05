import Alert from '../../atoms/Alert'
import Success from './Success'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'
import React, { ReactElement } from 'react'
import styles from './Feedback.module.css'

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
          <Success success={success} did={did} />
        ) : (
          <Loader message={publishStepText} />
        )}
      </div>
    </div>
  )
}
