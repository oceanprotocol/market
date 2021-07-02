import React, { useState, useEffect, ReactElement } from 'react'
import Status from '../../atoms/Status'
import Badge from '../../atoms/Badge'
import Tooltip from '../../atoms/Tooltip'
import { useWeb3 } from '../../../providers/Web3'
import NetworkName from '../../atoms/NetworkName'
import styles from './Network.module.css'
import { getOceanConfig } from '../../../utils/ocean'

export default function Network(): ReactElement {
  const { networkId, isTestnet } = useWeb3()

  const [isSupportedOceanNetwork, setIsSupportedOceanNetwork] =
    useState<boolean>()

  useEffect(() => {
    // take network from user when present
    const network = networkId || 1

    // Check networkId against ocean.js ConfigHelper configs
    // to figure out if network is supported.
    const isSupportedOceanNetwork = Boolean(getOceanConfig(network))
    setIsSupportedOceanNetwork(isSupportedOceanNetwork)
  }, [networkId])

  return networkId ? (
    <div className={styles.network}>
      {!isSupportedOceanNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      <NetworkName className={styles.name} networkId={networkId} minimal />
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
