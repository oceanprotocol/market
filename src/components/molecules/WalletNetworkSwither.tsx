import React, { ReactElement } from 'react'
import Button from '../atoms/Button'
import styles from './SyncStatus.module.css'

export default function WalletNetworkSwitcher(): ReactElement {
  const ddoNetworkName = 'ETH'
  const walletNetworkName = 'Polygon'

  function switchWalletNetwork() {
    console.log('switched')
  }

  return (
    <div className={styles.sync}>
      <p>
        {`You are watching OCEAN on ${ddoNetworkName} but your wallet is connected to ${walletNetworkName}.`}
      </p>
      <Button
        style="text"
        size="small"
        onClick={() => switchWalletNetwork()}
        className={styles.toggle}
      >
        {`Switch to ${ddoNetworkName}`}
      </Button>
    </div>
  )
}
