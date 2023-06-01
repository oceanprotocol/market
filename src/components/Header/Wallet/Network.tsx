import React, { ReactElement } from 'react'
import Status from '@shared/atoms/Status'
import Badge from '@shared/atoms/Badge'
import Tooltip from '@shared/atoms/Tooltip'
import NetworkName from '@shared/NetworkName'
import styles from './Network.module.css'
import { useNetwork } from 'wagmi'
import useNetworkMetadata from '@hooks/useNetworkMetadata'

export default function Network(): ReactElement {
  const { chain } = useNetwork()
  const { isTestnet, isSupportedOceanNetwork } = useNetworkMetadata()

  return chain?.id ? (
    <div className={styles.network}>
      {!isSupportedOceanNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      <NetworkName className={styles.name} networkId={chain.id} minimal />
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
