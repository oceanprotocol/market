import React, { ReactElement } from 'react'
import Button from '../atoms/Button'
import styles from './WalletNetworkSwitcher.module.css'

export default function WalletNetworkSwitcher(): ReactElement {
  const ddoNetworkName = 'ETH'
  const walletNetworkName = 'Polygon'

  function switchWalletNetwork() {
    console.log('switched')
  }

  return (
    <div className={styles.box}>
      <div className={styles.content}>
        <img
          src="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
          className={styles.image}
        />
        <div>
          <p>
            {`You are watching OCEAN on ${ddoNetworkName} but your wallet is connected to ${walletNetworkName}.`}
          </p>
          <Button
            style="primary"
            size="small"
            onClick={() => switchWalletNetwork()}
            className={styles.toggle}
          >
            {`Switch to ${ddoNetworkName}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
