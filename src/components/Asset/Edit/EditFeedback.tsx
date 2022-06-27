import Alert from '@shared/atoms/Alert'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import SuccessConfetti from '@shared/SuccessConfetti'
import React, { ReactElement, useState, FormEvent } from 'react'
import styles from './EditFeedback.module.css'

interface Action {
  name: string
  onClick?: () => void
  to?: string
}

function ActionSuccess({ action }: { action: Action }) {
  const { name, onClick, to } = action

  return (
    <Button
      style="primary"
      size="small"
      onClick={onClick || null}
      to={to || null}
      className={styles.action}
    >
      {name}
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

export default function EditFeedback({
  error,
  success,
  loading,
  successAction,
  setError
}: {
  error: string
  success: string
  loading: string
  successAction: Action
  setError: (error: string) => void
}): ReactElement {
  const [moreInfo, setMoreInfo] = useState<boolean>(false)

  function toggleMoreInfo(e: FormEvent<Element>) {
    e.preventDefault()
    moreInfo === true ? setMoreInfo(false) : setMoreInfo(true)
  }

  return (
    <div className={styles.feedback}>
      {error ? (
        <>
          <p>Sorry, something went wrong. Please try again.</p>
          {moreInfo && <Alert text={error} state="error" />}
          <Button
            style="text"
            size="small"
            onClick={toggleMoreInfo}
            className={styles.moreInfo}
          >
            {moreInfo === false ? 'More Info' : 'Hide error'}
          </Button>
          <ActionError setError={setError} />
        </>
      ) : success ? (
        <SuccessConfetti
          success={success}
          action={<ActionSuccess action={successAction} />}
        />
      ) : (
        <Loader message={loading} />
      )}
    </div>
  )
}
