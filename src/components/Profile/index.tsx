import React, { ReactElement } from 'react'
import HistoryPage from './History'
import AccountHeader from './Header'

export default function AccountPage({
  accountId
}: {
  accountId: string
}): ReactElement {
  return (
    <>
      <AccountHeader accountId={accountId} />
      <HistoryPage accountIdentifier={accountId} />
    </>
  )
}
