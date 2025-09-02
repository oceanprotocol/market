import React, { ReactElement } from 'react'
import Status from '@shared/atoms/Status'
import Badge from '@shared/atoms/Badge'
import Tooltip from '@shared/atoms/Tooltip'
import NetworkName from '@shared/NetworkName'
import styles from './Network.module.css'
import { useAppKitNetworkCore } from '@reown/appkit/react'
import useNetworkMetadata from '@hooks/useNetworkMetadata'

export default function Network(): ReactElement {
  const { chainId } = useAppKitNetworkCore()
  const { isTestnet, isSupportedOceanNetwork } = useNetworkMetadata()

  return chainId ? (
    <div className={styles.network}>
      {!isSupportedOceanNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      <NetworkName
        className={styles.name}
        networkId={Number(chainId)}
        minimal
      />
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
