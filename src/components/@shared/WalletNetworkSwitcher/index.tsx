import React, { ReactElement } from 'react'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import useNetworkMetadata, {
  getNetworkDataById,
  getNetworkDisplayName
} from '@hooks/useNetworkMetadata'
import { useAsset } from '@context/Asset'
import { useNetwork, useSwitchNetwork } from 'wagmi'

export default function WalletNetworkSwitcher(): ReactElement {
  const { chain } = useNetwork()
  const { asset } = useAsset()
  const { switchNetwork } = useSwitchNetwork({ chainId: asset?.chainId })
  const { networksList } = useNetworkMetadata()

  const ddoNetworkData = getNetworkDataById(networksList, asset.chainId)
  const walletNetworkData = getNetworkDataById(networksList, chain?.id)

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
      <Button size="small" onClick={() => switchNetwork()}>
        Switch to {ddoNetworkName}
      </Button>
    </>
  )
}
