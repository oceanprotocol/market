import React, { ReactElement, useState } from 'react'
import styles from './SyncStatus.module.css'
import Button from '../atoms/Button'

export default function TokenApproval({
  actionButton
}: {
  actionButton: JSX.Element
}): ReactElement {
  const [approveToken, setApproveToken] = useState(false)

  return (
    <div className={styles.sync}>
      {approveToken === false ? (
        <>
          {actionButton}
          <Button
            style="primary"
            size="small"
            onClick={() => {
              setApproveToken(true)
            }}
            disabled={false}
          >
            Approve TOKEN
          </Button>
        </>
      ) : (
        <>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              setApproveToken(false)
            }}
            disabled={false}
          >
            xxx TOKEN
          </Button>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              setApproveToken(false)
            }}
            disabled={false}
          >
            Infinite
          </Button>
        </>
      )}
    </div>
  )
}
