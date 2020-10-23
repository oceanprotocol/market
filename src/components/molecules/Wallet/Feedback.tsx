import React, { ReactElement } from 'react'
import Status from '../../atoms/Status'
import styles from './Feedback.module.css'
import { useOcean } from '@oceanprotocol/react'
import { getNetworkName } from '../../../utils/wallet'

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
  const { account, status, networkId } = useOcean()
  const isOceanConnectionError = status === -1
  const isMainnet = networkId === 1
  const showFeedback =
    !account ||
    isOceanConnectionError ||
    !isMainnet ||
    isBalanceSufficient === false

  const state = !account
    ? 'error'
    : !isMainnet
    ? 'warning'
    : account && isBalanceSufficient
    ? 'success'
    : 'warning'

  const title = !account
    ? 'No account connected'
    : isOceanConnectionError
    ? 'Error connecting to Ocean'
    : !isMainnet
    ? getNetworkName(networkId)
    : account
    ? isBalanceSufficient === false
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = !account
    ? 'Please connect your Web3 wallet.'
    : isOceanConnectionError
    ? 'Please try again.'
    : !isMainnet
    ? undefined
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
