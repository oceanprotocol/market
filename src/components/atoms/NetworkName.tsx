import React, { ReactElement } from 'react'
import { ReactComponent as EthIcon } from '../../images/eth.svg'
import { ReactComponent as PolygonIcon } from '../../images/polygon.svg'
import { ReactComponent as MoonbeamIcon } from '../../images/moonbeam.svg'
import { ReactComponent as BscIcon } from '../../images/bsc.svg'
import { getNetworkDataById, getNetworkDisplayName } from '../../utils/web3'
import styles from './NetworkName.module.css'
import useNetworkMetadata from '../../hooks/useNetworkMetadata'

export function NetworkIcon({ name }: { name: string }): ReactElement {
  const IconMapped = name.includes('ETH')
    ? EthIcon
    : name.includes('Polygon')
    ? PolygonIcon
    : name.includes('Moon')
    ? MoonbeamIcon
    : name.includes('BSC')
    ? BscIcon
    : EthIcon // ETH icon as fallback

  return IconMapped ? <IconMapped className={styles.icon} /> : null
}

export default function NetworkName({
  networkId,
  minimal,
  textOnly,
  className
}: {
  networkId: number
  minimal?: boolean
  textOnly?: boolean
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
      {textOnly || <NetworkIcon name={networkName} />}{' '}
      <span className={styles.name}>{networkName}</span>
    </span>
  )
}
