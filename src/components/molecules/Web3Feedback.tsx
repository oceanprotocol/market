import React, { ReactElement, useEffect } from 'react'
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
  isAssetNetwork
}: {
  isBalanceSufficient?: boolean
  isAssetNetwork?: boolean
}): ReactElement {
  const { accountId } = useWeb3()
  const { isGraphSynced, blockGraph, blockHead } = useGraphSyncStatus()
  const showFeedback =
    !accountId ||
    // !ocean ||
    isBalanceSufficient === false ||
    isAssetNetwork === false ||
    isGraphSynced === false

  const state =
    !accountId || !isGraphSynced
      ? 'error'
      : accountId && isBalanceSufficient && isAssetNetwork
      ? 'success'
      : 'warning'

  const title = !accountId
    ? 'No account connected'
    : // : !ocean
    // ? 'Error connecting to Ocean'
    accountId && isAssetNetwork === false
    ? 'Not connected to asset network'
    : isGraphSynced === false
    ? `The data for this network has only synced to Ethereum block ${blockGraph} (out of ${blockHead}). Please check back soon.`
    : accountId
    ? isBalanceSufficient === false
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = !accountId
    ? 'Please connect your Web3 wallet.'
    : // : !ocean
    // ? 'Please try again.'
    isBalanceSufficient === false
    ? 'You do not have enough OCEAN in your wallet to purchase this asset.'
    : isGraphSynced === false
    ? 'Due to innacurate data transactions may fail, thus loosing gas fees!'
    : 'Something went wrong.'

  useEffect(() => {
    console.log('is syunc', isGraphSynced)
  }, [isGraphSynced])

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
