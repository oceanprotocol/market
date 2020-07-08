import React, { ReactElement } from 'react'
import Status from '../../atoms/Status'
import styles from './Feedback.module.css'
import { useWeb3, useOcean } from '@oceanprotocol/react'

export declare type Web3Error = {
  status: 'error' | 'warning' | 'success'
  title: string
  message?: string
}

export default function Web3Feedback({
  isBalanceInsufficient
}: {
  isBalanceInsufficient?: boolean
}): ReactElement {
  const { ethProviderStatus } = useWeb3()
  const { status } = useOcean()
  const isEthProviderAbsent = ethProviderStatus === -1
  const isEthProviderDisconnected = ethProviderStatus === 0
  const isOceanDisconnected = status === 0
  const isOceanConnectionError = status === -1
  const hasSuccess = ethProviderStatus === 1 && status === 1

  const state = isEthProviderAbsent
    ? 'error'
    : hasSuccess && !isBalanceInsufficient
    ? 'success'
    : 'warning'

  const title = isEthProviderAbsent
    ? 'No Web3 Browser'
    : isEthProviderDisconnected
    ? 'No account connected'
    : isOceanDisconnected
    ? 'Not connected to Pacific network'
    : isOceanConnectionError
    ? 'Error connecting to Ocean'
    : hasSuccess
    ? isBalanceInsufficient === true
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = isEthProviderAbsent
    ? 'To download data sets you need a browser with Web3 capabilties, like Firefox with MetaMask installed.'
    : isEthProviderDisconnected
    ? 'Please connect your Web3 wallet.'
    : isOceanDisconnected
    ? 'Please connect in MetaMask to custom RPC https://pacific.oceanprotocol.com.'
    : isOceanConnectionError
    ? 'Try again.'
    : isBalanceInsufficient === true
    ? 'You do not have enough OCEAN in your wallet to purchase this asset.'
    : 'Something went wrong.'

  return !hasSuccess ? (
    <section className={styles.feedback}>
      <Status state={state} aria-hidden />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.error}>{message}</p>
    </section>
  ) : null
}
