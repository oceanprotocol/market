import React, { ReactElement } from 'react'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import useNetworkMetadata, {
  getNetworkDataById,
  getNetworkDisplayName
} from '@hooks/useNetworkMetadata'
import { useAsset } from '@context/Asset'
import { useAppKitNetwork, useAppKitNetworkCore } from '@reown/appkit/react'
import { AppKitNetwork } from '@reown/appkit/networks'

export default function WalletNetworkSwitcher(): ReactElement {
  const { asset } = useAsset()
  const { chainId } = useAppKitNetworkCore()
  const { switchNetwork } = useAppKitNetwork()
  const { networksList } = useNetworkMetadata()

  const ddoNetworkData = getNetworkDataById(networksList, asset.chainId)
  const walletNetworkData = getNetworkDataById(networksList, Number(chainId))

  const ddoNetworkName = (
    <strong>{getNetworkDisplayName(ddoNetworkData)}</strong>
  )
  const walletNetworkName = (
    <strong>{getNetworkDisplayName(walletNetworkData)}</strong>
  )

  return (
    <>
      <p className={styles.text}>
        This asset is published on {ddoNetworkName} but your wallet is connected
        to {walletNetworkName}. Connect to {ddoNetworkName} to interact with
        this asset.
      </p>
      <Button
        size="small"
        onClick={() =>
          switchNetwork(ddoNetworkData as unknown as AppKitNetwork)
        }
      >
        Switch to {ddoNetworkName}
      </Button>
    </>
  )
}
