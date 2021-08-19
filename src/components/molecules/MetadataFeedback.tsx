import Alert from '../atoms/Alert'
import Button from '../atoms/Button'
import Loader from '../atoms/Loader'
import React, { ReactElement, useState, FormEvent } from 'react'
import styles from './MetadataFeedback.module.css'
import SuccessConfetti from '../atoms/SuccessConfetti'
import { DDO } from '@oceanprotocol/lib'
import AssetTeaser from './AssetTeaser'

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

export default function MetadataFeedback({
  title,
  error,
  success,
  loading,
  successAction,
  setError,
  tutorial,
  ddo
}: {
  title: string
  error: string
  success: string
  loading?: string
  successAction: Action
  setError: (error: string) => void
  tutorial?: boolean
  ddo?: DDO
}): ReactElement {
  const [moreInfo, setMoreInfo] = useState<boolean>(false)

  function toggleMoreInfo(e: FormEvent<Element>) {
    e.preventDefault()
    moreInfo === true ? setMoreInfo(false) : setMoreInfo(true)
  }

  return (
    <div className={styles.feedback}>
      <div className={styles.box}>
        <h3>{title}</h3>
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
            action={
              tutorial && ddo ? (
                <div className={styles.teaser}>
                  <AssetTeaser ddo={ddo} price={ddo.price} />
                </div>
              ) : (
                <ActionSuccess action={successAction} />
              )
            }
          />
        ) : (
          <Loader message={loading} />
        )}
      </div>
    </div>
  )
}
