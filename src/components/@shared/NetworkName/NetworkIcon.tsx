import React, { ReactElement } from 'react'
import EthIcon from '@images/eth.svg'
import PolygonIcon from '@images/polygon.svg'
import MoonbeamIcon from '@images/moonbeam.svg'
import BscIcon from '@images/bsc.svg'
import EnergywebIcon from '@images/energyweb.svg'
import styles from './index.module.css'

export function NetworkIcon({ name }: { name: string }): ReactElement {
  const IconMapped = name.includes('ETH')
    ? EthIcon
    : name.includes('Polygon') || name.includes('Mumbai')
    ? PolygonIcon
    : name.includes('Moon')
    ? MoonbeamIcon
    : name.includes('BSC')
    ? BscIcon
    : name.includes('Energy Web')
    ? EnergywebIcon
    : EthIcon // ETH icon as fallback

  return <IconMapped className={styles.icon} />
}
