import ExplorerLink from '@shared/ExplorerLink'
import React from 'react'
import styles from './TransactionCount.module.css'
import Conversion from '@shared/Price/Conversion'

export default function TransactionCount({
  txCount,
  chainId,
  txHash,
  gasFees
}: {
  txCount: number
  chainId: number
  txHash: string
  gasFees?: string
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
      {txCount} Transaction{txCount > 1 ? 's' : ''}{' '}
      <Conversion price={gasFees} />
    </span>
  )
}
