import React, { useState, useEffect, ReactElement } from 'react'
import { useOcean } from '@oceanprotocol/react'
import Status from '../../atoms/Status'
import { getNetworkData } from '../../../utils/wallet'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import styles from './Network.module.css'
import axios from 'axios'
import Badge from '../../atoms/Badge'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import Tooltip from '../../atoms/Tooltip'

export default function Network(): ReactElement {
  const { appConfig } = useSiteMetadata()
  const { config, networkId } = useOcean()
  const networkIdConfig = (config as ConfigHelperConfig).networkId

  const [isMainnet, setIsMainnet] = useState<boolean>()
  const [networkName, setNetworkName] = useState<string>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [isSupportedNetwork, setIsSupportedNetwork] = useState<boolean>()

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

    const isSupportedNetwork = appConfig.supportedNetworks.includes(network)
    setIsSupportedNetwork(isSupportedNetwork)

    return () => {
      isMounted = false
      source.cancel()
    }
  }, [networkId, networkIdConfig, appConfig.supportedNetworks])

  return !isMainnet && networkName ? (
    <div className={styles.network}>
      {!isSupportedNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      <span className={styles.name}>{networkName}</span>
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
