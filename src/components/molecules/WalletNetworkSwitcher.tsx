import React, { ReactElement, useState, useEffect } from 'react'
import { useWeb3 } from '../../providers/Web3'
import { addCustomNetwork, getNetworkConfigObject } from '../../utils/web3'
import Button from '../atoms/Button'
import styles from './WalletNetworkSwitcher.module.css'
import useNetworkMetadata from '../../hooks/useNetworkMetadata'
import NetworkName from '../atoms/NetworkName'
import { getOceanConfig } from '../../utils/ocean'
import { useAsset } from '../../providers/Asset'

export default function WalletNetworkSwitcher(): ReactElement {
  const { networkId, web3Provider } = useWeb3()
  const { networksList } = useNetworkMetadata()
  const { ddo } = useAsset()
  const DEFAULT_ETH_CHAIN_IDS = [1, 3, 4]
  const showButton = !DEFAULT_ETH_CHAIN_IDS.includes(ddo.chainId)
  const oceanConfig = getOceanConfig(ddo.chainId)

  const ddoNetworkName = (
    <NetworkName
      networkId={ddo.chainId}
      textOnly
      className={styles.networkName}
    />
  )
  const walletNetworkName = (
    <NetworkName
      networkId={networkId}
      textOnly
      className={styles.networkName}
    />
  )

  async function switchWalletNetwork() {
    const networkNode = networksList.find(
      (data) => data.node.chainId === ddo.chainId
    ).node
    const network = { ...networkNode, providerUri: oceanConfig.providerUri }
    const networkConfig = getNetworkConfigObject(network)
    addCustomNetwork(web3Provider, networkConfig)
  }

  return (
    <div className={styles.switcher}>
      <div className={styles.content}>
        <p className={styles.title}>
          The current asset is on {ddoNetworkName} but your wallet is connected
          to {walletNetworkName}
        </p>
        {showButton ? (
          <Button
            style="primary"
            size="small"
            onClick={() => switchWalletNetwork()}
            className={styles.switchButton}
          >
            Switch to {ddoNetworkName}
          </Button>
        ) : (
          <p className={styles.title}>
            You must manually switch to {ddoNetworkName} on your wallet provider
          </p>
        )}
      </div>
    </div>
  )
}
