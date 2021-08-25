import React, { ReactElement } from 'react'
import { useWeb3 } from '../../providers/Web3'
import Status from '../atoms/Status'
import styles from './Web3Feedback.module.css'
import WalletNetworkSwitcher from './WalletNetworkSwitcher'
import { useGraphSyncStatus } from '../../hooks/useGraphSyncStatus'

export declare type Web3Error = {
  status: 'error' | 'warning' | 'success'
  title: string
  message?: string
}

export default function Web3Feedback({
  isBalanceSufficient,
  isAssetNetwork,
  tabName
}: {
  isBalanceSufficient?: boolean
  isAssetNetwork?: boolean
  tabName?: string
}): ReactElement {
  const { accountId } = useWeb3()
  const { isGraphSynced, blockGraph, blockHead } = useGraphSyncStatus()
  const showFeedback =
    !accountId ||
    (isBalanceSufficient === false && tabName === 'Use') ||
    isAssetNetwork === false ||
    isGraphSynced === false

  const state = !isAssetNetwork
    ? 'warning'
    : !accountId || !isGraphSynced
    ? 'error'
    : accountId && isBalanceSufficient && isAssetNetwork
    ? 'success'
    : 'warning'

  const title = !accountId
    ? 'No account connected'
    : accountId && isAssetNetwork === false
    ? 'Not connected to asset network'
    : isGraphSynced === false
    ? `Data out of sync`
    : accountId
    ? isBalanceSufficient === false && tabName === 'Use'
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = !accountId
    ? 'Please connect your Web3 wallet.'
    : tabName === 'Use' && isBalanceSufficient === false
    ? 'You do not have enough OCEAN in your wallet to purchase this asset.'
    : isGraphSynced === false
    ? `The data for this network has only synced to Ethereum block ${blockGraph} (out of ${blockHead}). Transactions may fail! Please check back soon`
    : 'Something went wrong.'

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
