import React, { ReactElement } from 'react'
import HistoryPage from './History'
import AccountHeader from './Header'
import Button from '../../atoms/Button'
import styles from './index.module.css'

export default function AccountPage({
  accountId
}: {
  accountId: string
}): ReactElement {
  return (
    <div className={styles.profile}>
      <AccountHeader accountId={accountId} />
      <HistoryPage accountIdentifier={accountId} />

      <Button
        className={styles.printButton}
        onClick={() => {
          window.print()
        }}
        style="primary"
      >
        Print
      </Button>
    </div>
  )
}
