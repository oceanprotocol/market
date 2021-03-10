import React, { ReactElement } from 'react'
import { useOcean } from '../../../providers/Ocean'
import Status from '../../atoms/Status'
import styles from './Feedback.module.css'

export declare type Web3Error = {
  status: 'error' | 'warning' | 'success'
  title: string
  message?: string
}

export default function Web3Feedback({
  isBalanceSufficient
}: {
  isBalanceSufficient?: boolean
}): ReactElement {
  const { account, status } = useOcean()
  const isOceanConnectionError = status === -1
  const showFeedback =
    !account || isOceanConnectionError || isBalanceSufficient === false

  const state = !account
    ? 'error'
    : account && isBalanceSufficient
    ? 'success'
    : 'warning'

  const title = !account
    ? 'No account connected'
    : isOceanConnectionError
    ? 'Error connecting to Ocean'
    : account
    ? isBalanceSufficient === false
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = !account
    ? 'Please connect your Web3 wallet.'
    : isOceanConnectionError
    ? 'Please try again.'
    : isBalanceSufficient === false
    ? 'You do not have enough OCEAN in your wallet to purchase this asset.'
    : 'Something went wrong.'

  return showFeedback ? (
    <section className={styles.feedback}>
      <Status state={state} aria-hidden />
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.error}>{message}</p>}
    </section>
  ) : null
}
