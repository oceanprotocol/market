import React, { ReactElement } from 'react'
import HistoryPage from './History'
import AccountHeader from './Header'
import { useWeb3 } from '../../../providers/Web3'

export default function AccountPage({
  accountIdentifier
}: {
  accountIdentifier: string
}): ReactElement {
  const { accountId } = useWeb3()
  if (!accountIdentifier) accountIdentifier = accountId

  return (
    <article>
      <AccountHeader accountId={accountIdentifier} />
      <HistoryPage accountIdentifier={accountIdentifier} />
    </article>
  )
}
