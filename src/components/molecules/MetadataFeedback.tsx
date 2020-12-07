import Alert from '../atoms/Alert'
import Button from '../atoms/Button'
import Loader from '../atoms/Loader'
import React, { ReactElement } from 'react'
import styles from './MetadataFeedback.module.css'
import SuccessConfetti from '../atoms/SuccessConfetti'

interface SuccessAction {
  name: string
  onClick?: () => void
  to?: string
}

function ActionSuccess({ successAction }: { successAction: SuccessAction }) {
  return (
    <Button
      style="primary"
      size="small"
      onClick={successAction.onClick ? successAction.onClick : null}
      to={successAction.to ? successAction.to : null}
      className={styles.action}
    >
      successAction.name
    </Button>
  )
}

function ActionError({ setError }: { setError: (error: string) => void }) {
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

export default function MetadataFeedback({
  title,
  error,
  success,
  loading,
  successAction,
  setError
}: {
  title: string
  error: string
  success: string
  loading: string
  successAction: SuccessAction
  setError: (error: string) => void
}): ReactElement {
  return (
    <div className={styles.feedback}>
      <div className={styles.box}>
        <h3>{title}</h3>
        {error ? (
          <>
            <Alert text={error} state="error" />
            <ActionError setError={setError} />
          </>
        ) : success ? (
          <SuccessConfetti
            success={success}
            action={<ActionSuccess successAction={successAction} />}
          />
        ) : (
          <Loader message={loading} />
        )}
      </div>
    </div>
  )
}
