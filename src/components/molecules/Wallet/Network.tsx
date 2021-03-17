import React, { useState, useEffect, ReactElement } from 'react'
import { useOcean } from '../../../providers/Ocean'
import Status from '../../atoms/Status'
import { ConfigHelper } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import styles from './Network.module.css'
import Badge from '../../atoms/Badge'
import Tooltip from '../../atoms/Tooltip'
import { useWeb3 } from '../../../providers/Web3'

export default function Network(): ReactElement {
  const { networkId, networkDisplayName, isTestnet } = useWeb3()
  const { config } = useOcean()
  const networkIdConfig = (config as ConfigHelperConfig).networkId

  const [isEthMainnet, setIsEthMainnet] = useState<boolean>()
  const [isSupportedNetwork, setIsSupportedNetwork] = useState<boolean>()

  useEffect(() => {
    // take network from user when present,
    // otherwise use the default configured one of app
    const network = networkId || networkIdConfig
    const isEthMainnet = network === 1
    setIsEthMainnet(isEthMainnet)

    // Check networkId against ocean.js ConfigHelper configs
    // to figure out if network is supported.
    const isSupportedNetwork = Boolean(new ConfigHelper().getConfig(network))
    setIsSupportedNetwork(isSupportedNetwork)
  }, [networkId, networkIdConfig])

  return !isEthMainnet && networkDisplayName ? (
    <div className={styles.network}>
      {!isSupportedNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      <span className={styles.name}>{networkDisplayName}</span>
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
