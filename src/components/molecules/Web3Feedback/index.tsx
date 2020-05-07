import React from 'react'
import useOcean, { OceanConnectionStatus } from '../../../hooks/useOcean'
import { InjectedProviderStatus } from '../../../context/Web3Context'
import Status from '../../atoms/Status'
import Wallet from './Wallet'
import styles from './index.module.css'
import useWeb3 from '../../../hooks/useWeb3'

export declare type Web3Error = {
  status: 'error' | 'warning' | 'success'
  title: string
  message?: string
}

export default function Web3Feedback({
  isBalanceInsufficient
}: {
  isBalanceInsufficient?: boolean
}) {
  const { web3, ethProviderStatus } = useWeb3()
  const { oceanConnectionStatus, balance } = useOcean(web3)

  const isEthProviderAbsent =
    ethProviderStatus === InjectedProviderStatus.NOT_AVAILABLE
  const isEthProviderDisconnected =
    ethProviderStatus === InjectedProviderStatus.NOT_CONNECTED
  const isOceanDisconnected =
    oceanConnectionStatus === OceanConnectionStatus.NOT_CONNECTED
  const isOceanConnectionError =
    oceanConnectionStatus === OceanConnectionStatus.OCEAN_CONNECTION_ERROR
  const hasSuccess =
    ethProviderStatus === InjectedProviderStatus.CONNECTED &&
    oceanConnectionStatus === OceanConnectionStatus.CONNECTED

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

  return (
    <section className={styles.feedback}>
      <div className={styles.statuscontainer}>
        <Status state={state} aria-hidden />
        <h3 className={styles.title}>{title}</h3>
        {!hasSuccess && <p className={styles.error}>{message}</p>}
      </div>
      {!isEthProviderAbsent && (
        <div className={styles.walletcontainer}>
          <Wallet balanceOcean={balance} />
        </div>
      )}
    </section>
  )
}
