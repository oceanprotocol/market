import React, { ReactElement } from 'react'
import { useWeb3 } from '../../providers/Web3'
import {
  addCustomNetwork,
  getNetworkConfigObject,
  getNetworkDisplayName,
  getNetworkDataById
} from '../../utils/web3'
import Button from '../atoms/Button'
import styles from './WalletNetworkSwitcher.module.css'
import useNetworkMetadata from '../../hooks/useNetworkMetadata'
import { getOceanConfig } from '../../utils/ocean'
import { useAsset } from '../../providers/Asset'

export default function WalletNetworkSwitcher(): ReactElement {
  const { networkId, web3Provider } = useWeb3()
  const { ddo } = useAsset()
  const oceanConfig = getOceanConfig(ddo.chainId)
  const { networksList } = useNetworkMetadata()
  const ddoNetworkData = getNetworkDataById(networksList, ddo.chainId)
  const walletNetworkData = getNetworkDataById(networksList, networkId)

  const ddoNetworkName = (
    <span className={styles.networkName}>
      {getNetworkDisplayName(ddoNetworkData, ddo.chainId)}
    </span>
  )
  const walletNetworkName = (
    <span className={styles.networkName}>
      {getNetworkDisplayName(walletNetworkData, networkId)}
    </span>
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
        <Button
          style="primary"
          size="small"
          onClick={() => switchWalletNetwork()}
          className={styles.switchButton}
        >
          Switch to {ddoNetworkName}
        </Button>
      </div>
    </div>
  )
}
