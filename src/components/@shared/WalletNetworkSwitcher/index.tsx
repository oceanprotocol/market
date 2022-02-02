import React, { ReactElement } from 'react'
import { useWeb3 } from '@context/Web3'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import { addCustomNetwork } from '@utils/web3'
import useNetworkMetadata, {
  getNetworkDataById,
  getNetworkDisplayName
} from '@hooks/useNetworkMetadata'
import { useAsset } from '@context/Asset'

export default function WalletNetworkSwitcher(): ReactElement {
  const { networkId, web3Provider } = useWeb3()
  const { assetExtended } = useAsset()
  const { networksList } = useNetworkMetadata()
  const ddoNetworkData = getNetworkDataById(networksList, assetExtended.chainId)
  const walletNetworkData = getNetworkDataById(networksList, networkId)

  const ddoNetworkName = (
    <strong>
      {getNetworkDisplayName(ddoNetworkData, assetExtended.chainId)}
    </strong>
  )
  const walletNetworkName = (
    <strong>{getNetworkDisplayName(walletNetworkData, networkId)}</strong>
  )

  async function switchWalletNetwork() {
    const networkNode = await networksList.find(
      (data) => data.chainId === assetExtended.chainId
    )
    addCustomNetwork(web3Provider, networkNode)
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
