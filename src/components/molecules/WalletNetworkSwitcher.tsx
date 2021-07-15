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
    <strong>{getNetworkDisplayName(ddoNetworkData, ddo.chainId)}</strong>
  )
  const walletNetworkName = (
    <strong>{getNetworkDisplayName(walletNetworkData, networkId)}</strong>
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
    <>
      <p className={styles.text}>
        This asset is published on {ddoNetworkName} but your wallet is connected
        to {walletNetworkName}. Connect to {ddoNetworkName} to interact with
        this asset.
      </p>
      <Button size="small" onClick={() => switchWalletNetwork()}>
        Switch to {ddoNetworkName}
      </Button>
    </>
  )
}
