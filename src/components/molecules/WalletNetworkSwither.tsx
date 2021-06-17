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
  const DEFOULT_ETH_CHAIN_IDS = [1, 3, 4]
  const [assetChainId, setAssetChainId] = useState()
  const showButton = !DEFOULT_ETH_CHAIN_IDS.includes(assetChainId)
  const oceanConfig = getOceanConfig(assetChainId)

  const ddoNetworkName = <NetworkName networkId={assetChainId} textOnly />
  const walletNetworkName = <NetworkName networkId={networkId} textOnly />

  async function switchWalletNetwork() {
    const networkNode = networksList.find(
      (data) => data.node.chainId === assetChainId
    ).node
    const network = { ...networkNode, providerUri: oceanConfig.providerUri }
    const networkConfig = getNetworkConfigObject(network)
    addCustomNetwork(web3Provider, networkConfig)
  }

  useEffect(() => {
    if (!ddo.chainId) return
    setAssetChainId(ddo.chainId)
  }, [])

  return (
    <div className={styles.switcher}>
      <img
        src="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>
          You are watching OCEAN on {ddoNetworkName} but your wallet is
          connected to {walletNetworkName}
        </h3>
        {showButton ? (
          <Button
            style="primary"
            size="small"
            onClick={() => switchWalletNetwork()}
            className={styles.toggle}
          >
            Switch to {ddoNetworkName}
          </Button>
        ) : (
          <h3 className={styles.title}>
            You must manually switch to {ddoNetworkName} on your wallet provider
          </h3>
        )}
      </div>
    </div>
  )
}
