import Alert from '../atoms/Alert'
import Button from '../atoms/Button'
import Loader from '../atoms/Loader'
import React, { ReactElement } from 'react'
import {
  action as actionStyle,
  feedback,
  box
} from './MetadataFeedback.module.css'
import SuccessConfetti from '../atoms/SuccessConfetti'

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
      className={actionStyle}
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
      className={actionStyle}
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
  loading?: string
  successAction: Action
  setError: (error: string) => void
}): ReactElement {
  return (
    <div className={feedback}>
      <div className={box}>
        <h3>{title}</h3>
        {error ? (
          <>
            <Alert text={error} state="error" />
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
    </div>
  )
}
