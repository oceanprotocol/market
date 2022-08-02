import React, { ReactElement } from 'react'
import HistoryPage from './History'

export default function SettingsPage({
  accountId
}: {
  accountId: string
}): ReactElement {
  return (
    <>
      <HistoryPage accountIdentifier={accountId} />
    </>
  )
}
