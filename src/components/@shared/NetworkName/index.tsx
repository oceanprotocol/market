import React, { ReactElement } from 'react'
import { getNetworkDataById, getNetworkDisplayName } from '@utils/web3'
import styles from './index.module.css'
import useNetworkMetadata from '@hooks/useNetworkMetadata'
import { NetworkIcon } from './NetworkIcon'

export default function NetworkName({
  networkId,
  minimal,
  className
}: {
  networkId: number
  minimal?: boolean
  className?: string
}): ReactElement {
  const { networksList } = useNetworkMetadata()
  const networkData = getNetworkDataById(networksList, networkId)
  const networkName = getNetworkDisplayName(networkData, networkId)

  return (
    <span
      className={`${styles.network} ${minimal ? styles.minimal : null} ${
        className || ''
      }`}
      title={networkName}
    >
      <NetworkIcon name={networkName} />{' '}
      <span className={styles.name}>{networkName}</span>
    </span>
  )
}
