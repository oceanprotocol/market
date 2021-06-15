import React, { ReactElement } from 'react'
import { useWeb3 } from '../../providers/Web3'
import { addCustomNetwork, getNetworkConfigForMetamask } from '../../utils/web3'
import Button from '../atoms/Button'
import styles from './WalletNetworkSwitcher.module.css'
import NetworkName from '../atoms/NetworkName'

export default function WalletNetworkSwitcher(): ReactElement {
  const { networkId, web3Provider } = useWeb3()

  const ddoNetworkName = <NetworkName networkId={1} textOnly />
  const walletNetworkName = <NetworkName networkId={networkId} textOnly />

  async function switchWalletNetwork() {
    const network = getNetworkConfigForMetamask(1)
    addCustomNetwork(web3Provider, network)
  }

  return (
    <div className={styles.content}>
      <img
        src="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
        className={styles.image}
      />
      <div>
        <h3 className={styles.title}>
          You are watching OCEAN on {ddoNetworkName} but your wallet is
          connected to {walletNetworkName}
        </h3>
        <Button
          style="primary"
          size="small"
          onClick={() => switchWalletNetwork()}
          className={styles.toggle}
        >
          Switch to {ddoNetworkName}
        </Button>
      </div>
    </div>
  )
}
