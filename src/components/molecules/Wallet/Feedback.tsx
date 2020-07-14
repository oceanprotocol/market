import React, { ReactElement } from 'react'
import Status from '../../atoms/Status'
import styles from './Feedback.module.css'
import { useOcean } from '@oceanprotocol/react'

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
  const { web3, status } = useOcean()
  const isOceanDisconnected = status === 0
  const isOceanConnectionError = status === -1

  const state = !web3
    ? 'error'
    : web3 && !isBalanceInsufficient
    ? 'success'
    : 'warning'

  const title = !web3
    ? 'No account connected'
    : isOceanDisconnected
    ? 'Not connected to Pacific network'
    : isOceanConnectionError
    ? 'Error connecting to Ocean'
    : web3
    ? isBalanceInsufficient === true
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = !web3
    ? 'Please connect your Web3 wallet.'
    : isOceanDisconnected
    ? 'Please connect in MetaMask to custom RPC https://pacific.oceanprotocol.com.'
    : isOceanConnectionError
    ? 'Try again.'
    : isBalanceInsufficient === true
    ? 'You do not have enough OCEAN in your wallet to purchase this asset.'
    : 'Something went wrong.'

  return web3 ? (
    <section className={styles.feedback}>
      <Status state={state} aria-hidden />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.error}>{message}</p>
    </section>
  ) : null
}
