import React, { ReactElement } from 'react'
import { useOcean } from '../../providers/Ocean'
import Status from '../atoms/Status'
import styles from './Web3Feedback.module.css'

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
  const { account, ocean } = useOcean()
  const showFeedback =
    !account ||
    !ocean ||
    isBalanceSufficient === false ||
    isAssetNetwork === false

  const state = !account
    ? 'error'
    : account && isBalanceSufficient && isAssetNetwork
    ? 'success'
    : 'warning'

  const title = !account
    ? 'No account connected'
    : !ocean
    ? 'Error connecting to Ocean'
    : account && isAssetNetwork === false
    ? 'Wrong network'
    : account
    ? isBalanceSufficient === false
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = !account
    ? 'Please connect your Web3 wallet.'
    : !ocean
    ? 'Please try again.'
    : isBalanceSufficient === false
    ? 'You do not have enough OCEAN in your wallet to purchase this asset.'
    : isAssetNetwork === false
    ? 'Connect to the asset network.'
    : 'Something went wrong.'

  return showFeedback ? (
    <section className={styles.feedback}>
      <Status state={state} aria-hidden />
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.error}>{message}</p>}
    </section>
  ) : null
}
