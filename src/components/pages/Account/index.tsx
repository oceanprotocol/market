import React, { ReactElement } from 'react'
import HistoryPage from './History'
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
      {accountIdentifier ? (
        <p>WIP Account metadata header for user: {accountIdentifier}</p>
      ) : (
        <p>Please connect your Web3 wallet.</p>
      )}
      <HistoryPage accountId={accountIdentifier} />
    </article>
  )
}
