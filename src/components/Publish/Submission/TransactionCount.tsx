import ExplorerLink from '@shared/ExplorerLink'
import React from 'react'
import styles from './TransactionCount.module.css'

export default function TransactionCount({
  txCount,
  chainId,
  txHash
}: {
  txCount: number
  chainId: number
  txHash: string
}) {
  return txHash ? (
    <ExplorerLink
      networkId={chainId}
      path={`/tx/${txHash}`}
      className={styles.txHash}
    >
      View Transaction
    </ExplorerLink>
  ) : (
    <span className={styles.txHash}>
      {txCount} Transaction{txCount > 1 ? 's' : ''}
    </span>
  )
}
