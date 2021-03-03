import React, { useState, useEffect, ReactElement } from 'react'
import { useOcean } from '@oceanprotocol/react'
// import Status from '../../atoms/Status'
import { getNetworkData } from '../../../utils/wallet'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import styles from './Network.module.css'
import axios from 'axios'
import Badge from '../../atoms/Badge'

export default function Network(): ReactElement {
  const { config, networkId } = useOcean()
  const networkIdConfig = (config as ConfigHelperConfig).networkId

  const [isMainnet, setIsMainnet] = useState<boolean>()
  const [networkName, setNetworkName] = useState<string>()
  const [isTestnet, setIsTestnet] = useState<boolean>()

  useEffect(() => {
    let isMounted = true
    const source = axios.CancelToken.source()

    // take network from user when present,
    // otherwise use the default configured one of app
    const network = networkId || networkIdConfig
    const isMainnet = network === 1
    setIsMainnet(isMainnet)

    async function getName() {
      const networkData = await getNetworkData(network, source.token)

      if (isMounted) {
        setIsTestnet(networkData.data.network !== 'mainnet')
        setNetworkName(networkData.displayName)
      }
    }
    getName()

    return () => {
      isMounted = false
      source.cancel()
    }
  }, [networkId, networkIdConfig])

  return !isMainnet ? (
    <div className={styles.network}>
      {/* <Status state="warning" aria-hidden /> */}
      <span className={styles.name}>{networkName}</span>
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
