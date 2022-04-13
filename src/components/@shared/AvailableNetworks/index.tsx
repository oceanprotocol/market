import React, { ReactElement } from 'react'
import styles from './index.module.css'
import NetworkOptions from './networkOptions'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'

export default function AvailableNetworks(): ReactElement {
  const { networksList } = useNetworkMetadata()
  const { appConfig } = useSiteMetadata()

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
  const networkCategories = [
    { title: 'Main', data: networksMain },
    { title: 'Test', data: networksTest }
  ]

  const content = (networks: number[]) =>
    networks.map((chainId) => (
      <NetworkOptions key={chainId} chainId={chainId} />
    ))

  return (
    <div className={styles.content}>
      Assets are published to the network your wallet is conected to. These
      networks are currently supported:
      {networkCategories.map(
        (networkCategory) =>
          networkCategory.data.length > 0 && (
            <>
              <h4 className={styles.title}>{networkCategory.title}</h4>
              <div className={styles.networks}>
                {content(networkCategory.data)}
              </div>
            </>
          )
      )}
    </div>
  )
}
