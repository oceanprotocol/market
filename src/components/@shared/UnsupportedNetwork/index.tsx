import React, { ReactElement } from 'react'
import styles from './index.module.css'
import NetworkOptions from './networkOptions'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import useNetworkMetadata, {
  filterNetworksByType
} from '@hooks/useNetworkMetadata'

export default function UnsuportedNetwork(): ReactElement {
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
    <>
      You are currently on an unsupported network. To proceed with publishing,
      please switch to one of our supported networks:
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
    </>
  )
}
