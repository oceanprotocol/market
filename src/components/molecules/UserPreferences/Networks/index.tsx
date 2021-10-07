import React, { ReactElement } from 'react'
import Label from '../../../atoms/Input/Label'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import FormHelp from '../../../atoms/Input/Help'
import { EthereumListsChain, getNetworkDataById } from '../../../../utils/web3'
import Tooltip from '../../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../../images/caret.svg'
import { ReactComponent as Network } from '../../../../images/network.svg'
import NetworksList from './NetworksList'
import stylesIndex from '../index.module.css'
import styles from './index.module.css'
import useNetworkMetadata from '../../../../hooks/useNetworkMetadata'
import { useUserPreferences } from '../../../../providers/UserPreferences'

export function filterNetworksByType(
  type: 'mainnet' | 'testnet',
  chainIds: number[],
  networksList: { node: EthereumListsChain }[]
): number[] {
  const finalNetworks = chainIds.filter((chainId: number) => {
    const networkData = getNetworkDataById(networksList, chainId)

    // HEADS UP! Only networkData.network === 'mainnet' is consistent
    // while not every test network in the network data has 'testnet'
    // in its place. So for the 'testnet' case filter for all non-'mainnet'.
    //
    // HEADS UP NO. 2! We hack in mainnet detection for moonriver as their
    // network data uses the `network` key wrong over in
    // https://github.com/ethereum-lists/chains/blob/master/_data/chains/eip155-1285.json
    //
    return type === 'mainnet'
      ? networkData.network === type || networkData.network === 'moonriver'
      : networkData.network !== 'mainnet' && networkData.network !== 'moonriver'
  })
  return finalNetworks
}

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
