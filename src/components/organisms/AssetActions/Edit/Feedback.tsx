import Alert from '../../../atoms/Alert'
import Button from '../../../atoms/Button'
import Loader from '../../../atoms/Loader'
import React, { ReactElement } from 'react'
import styles from './Feedback.module.css'
import SuccessConfetti from '../../../atoms/SuccessConfetti'

function SuccessAction() {
  return (
    <Button
      style="primary"
      size="small"
      onClick={() => window.location.reload()}
      className={styles.action}
    >
      Refresh Page
    </Button>
  )
}

function ErrorAction({ setError }: { setError: (error: string) => void }) {
  return (
    <Button
      style="primary"
      size="small"
      className={styles.action}
      onClick={() => setError(undefined)}
    >
      Try Again
    </Button>
  )
}

export default function Feedback({
  error,
  success,
  loaderText,
  setError
}: {
  error: string
  success: string
  loaderText: string
  setError: (error: string) => void
}): ReactElement {
  return (
    <div className={styles.feedback}>
      <div className={styles.box}>
        <h3>Updating Data Set</h3>
        {error ? (
          <>
            <Alert text={error} state="error" />
            <ErrorAction setError={setError} />
          </>
        ) : success ? (
          <SuccessConfetti success={success} action={<SuccessAction />} />
        ) : (
          <Loader message={loaderText} />
        )}
      </div>
    </div>
  )
}
