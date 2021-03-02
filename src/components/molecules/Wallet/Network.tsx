import React, { useState, useEffect, ReactElement } from 'react'
import { useOcean } from '@oceanprotocol/react'
import Status from '../../atoms/Status'
import { getNetworkName } from '../../../utils/wallet'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import styles from './Network.module.css'

export default function Network(): ReactElement {
  const { config, networkId } = useOcean()
  const [networkToShow, setNetworkToShow] = useState<number>()
  const [isMainnet, setIsMainnet] = useState<boolean>()

  useEffect(() => {
    // take network from user when present, otherwise the default configured one of app
    const networktoShow = networkId || (config as ConfigHelperConfig).networkId
    setNetworkToShow(networktoShow)

    const isMainnet = networktoShow === 1
    setIsMainnet(isMainnet)
  }, [networkId, config])

  return !isMainnet && networkToShow ? (
    <div className={styles.network}>
      <Status state="warning" aria-hidden />
      <span className={styles.name}>{getNetworkName(networkToShow)}</span>
    </div>
  ) : null
}
