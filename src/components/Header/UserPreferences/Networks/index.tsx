import React, { ReactElement } from 'react'
import Label from '@shared/Form/Input/Label'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import FormHelp from '@shared/Form/Input/Help'
import Tooltip from '@shared/atoms/Tooltip'
import Caret from '@images/caret.svg'
import Network from '@images/network.svg'
import NetworksList from './NetworksList'
import stylesIndex from '../index.module.css'
import styles from './index.module.css'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'
import { useUserPreferences } from '@context/UserPreferences'

export default function Networks(): ReactElement {
  const { networksList } = useNetworkMetadata()
  const { appConfig } = useSiteMetadata()
  const { chainIds } = useUserPreferences()

  const networksMain = filterNetworksByType(
    'mainnet',
    appConfig.chainIdsSupported,
    networksList
  )

  const networksTest = filterNetworksByType(
    'testnet',
    appConfig.chainIdsSupported,
    networksList
  )

  return (
    <Tooltip
      content={
        <ul className={stylesIndex.preferencesDetails}>
          <li>
            <Label htmlFor="chains">Networks</Label>
            <FormHelp>Switch the data source for the interface.</FormHelp>

            <NetworksList title="Main" networks={networksMain} />
            <NetworksList title="Test" networks={networksTest} />
          </li>
        </ul>
      }
      trigger="click focus"
      className={`${stylesIndex.preferences} ${styles.networks}`}
    >
      <Network aria-label="Networks" className={stylesIndex.icon} />
      <Caret aria-hidden="true" className={stylesIndex.caret} />

      <div className={styles.chainsSelected}>
        {chainIds.map((chainId) => (
          <span className={styles.chainsSelectedIndicator} key={chainId} />
        ))}
      </div>
    </Tooltip>
  )
}
