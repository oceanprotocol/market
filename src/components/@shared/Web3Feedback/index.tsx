import React, { ReactElement, useEffect, useState } from 'react'
import Status from '@shared/atoms/Status'
import styles from './index.module.css'
import WalletNetworkSwitcher from '../WalletNetworkSwitcher'
import { useGraphSyncStatus } from '@hooks/useGraphSyncStatus'

export declare type Web3Error = {
  status: 'error' | 'warning' | 'success'
  title: string
  message?: string
}

export default function Web3Feedback({
  networkId,
  accountId,
  isAssetNetwork
}: {
  networkId: number
  accountId: string
  isAssetNetwork?: boolean
}): ReactElement {
  const { isGraphSynced, blockGraph, blockHead } = useGraphSyncStatus(networkId)
  const [state, setState] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [showFeedback, setShowFeedback] = useState<boolean>(false)

  useEffect(() => {
    setShowFeedback(
      !accountId || isAssetNetwork === false || isGraphSynced === false
    )
    if (accountId && isAssetNetwork && isGraphSynced) return
    if (!accountId) {
      setState('error')
      setTitle('No account connected')
      setMessage('Please connect your Web3 wallet.')
    } else if (isAssetNetwork === false) {
      setState('error')
      setTitle('Not connected to asset network')
      setMessage('Please connect your Web3 wallet.')
    } else if (isGraphSynced === false) {
      setState('warning')
      setTitle('Data out of sync')
      setMessage(
        `The data for this network has only synced to Ethereum block ${blockGraph} (out of ${blockHead}). Transactions may fail! Please check back soon.`
      )
    } else {
      setState('warning')
      setTitle('Something went wrong.')
      setMessage('Something went wrong.')
    }
  }, [accountId, isGraphSynced, isAssetNetwork])

  return showFeedback ? (
    <section className={styles.feedback}>
      <Status state={state} aria-hidden />
      <h3 className={styles.title}>{title}</h3>
      {isAssetNetwork === false ? (
        <WalletNetworkSwitcher />
      ) : (
        message && <p className={styles.error}>{message}</p>
      )}
    </section>
  ) : null
}
