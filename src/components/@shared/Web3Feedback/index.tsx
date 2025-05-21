import React, { ReactElement, useEffect, useState } from 'react'
import Status from '@shared/atoms/Status'
import styles from './index.module.css'
import WalletNetworkSwitcher from '../WalletNetworkSwitcher'

export declare type Web3Error = {
  status: 'error' | 'warning' | 'success'
  title: string
  message?: string
}

export default function Web3Feedback({
  accountId,
  isAssetNetwork
}: {
  networkId: number
  accountId: string
  isAssetNetwork?: boolean
}): ReactElement {
  const [state, setState] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [showFeedback, setShowFeedback] = useState<boolean>(false)

  useEffect(() => {
    setShowFeedback(!accountId || isAssetNetwork === false)
    if (accountId && isAssetNetwork) return
    if (!accountId) {
      setState('error')
      setTitle('No account connected')
      setMessage('Please connect your wallet.')
    } else if (isAssetNetwork === false) {
      setState('error')
      setTitle('Not connected to asset network')
      setMessage('Please connect your wallet.')
    } else {
      setState('warning')
      setTitle('Something went wrong.')
      setMessage('Something went wrong.')
    }
  }, [accountId, isAssetNetwork])

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
