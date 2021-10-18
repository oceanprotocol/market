import React, { ReactElement } from 'react'
import { ReactComponent as EthIcon } from '@images/eth.svg'
import { ReactComponent as PolygonIcon } from '@images/polygon.svg'
import { ReactComponent as MoonbeamIcon } from '@images/moonbeam.svg'
import { ReactComponent as BscIcon } from '@images/bsc.svg'
import { ReactComponent as EnergywebIcon } from '@images/energyweb.svg'
import styles from './index.module.css'

export function NetworkIcon({ name }: { name: string }): ReactElement {
  const IconMapped = name.includes('ETH')
    ? EthIcon
    : name.includes('Polygon')
    ? PolygonIcon
    : name.includes('Moon')
    ? MoonbeamIcon
    : name.includes('BSC')
    ? BscIcon
    : name.includes('Energy Web')
    ? EnergywebIcon
    : EthIcon // ETH icon as fallback

  return IconMapped ? <IconMapped className={styles.icon} /> : null
}
