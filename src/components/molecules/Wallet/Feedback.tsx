import React, { ReactElement } from 'react'
import Status from '../../atoms/Status'
import styles from './Feedback.module.css'
import { useOcean } from '@oceanprotocol/react'
import { isCorrectNetwork, getNetworkName } from '../../../utils/wallet'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

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
  const { appConfig } = useSiteMetadata()
  const { account, status, chainId } = useOcean()
  const isOceanConnectionError = status === -1
  const correctNetwork = isCorrectNetwork(chainId)
  const showFeedback = !account || isOceanConnectionError || !correctNetwork
  const allowedNetworkNames = appConfig.networks.map((network: number) =>
    getNetworkName(network)
  )

  const state = !account
    ? 'error'
    : !correctNetwork
    ? 'warning'
    : account && !isBalanceInsufficient
    ? 'success'
    : 'warning'

  const title = !account
    ? 'No account connected'
    : isOceanConnectionError
    ? 'Error connecting to Ocean'
    : !correctNetwork
    ? 'Wrong Network'
    : account
    ? isBalanceInsufficient === true
      ? 'Insufficient balance'
      : 'Connected to Ocean'
    : 'Something went wrong'

  const message = !account
    ? 'Please connect your Web3 wallet.'
    : isOceanConnectionError
    ? 'Please try again.'
    : !correctNetwork
    ? `Please connect to ${allowedNetworkNames}.`
    : isBalanceInsufficient === true
    ? 'You do not have enough OCEAN in your wallet to purchase this asset.'
    : 'Something went wrong.'

  return showFeedback ? (
    <section className={styles.feedback}>
      <Status state={state} aria-hidden />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.error}>{message}</p>
    </section>
  ) : null
}
