import React, { ReactElement } from 'react'
import Label from '../../../atoms/Input/Label'
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata'
import FormHelp from '../../../atoms/Input/Help'
import { useStaticQuery, graphql } from 'gatsby'
import { EthereumListsChain, getNetworkDataById } from '../../../../utils/web3'
import Tooltip from '../../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../../images/caret.svg'
import { ReactComponent as Network } from '../../../../images/network.svg'
import ChainsList from './ChainsList'
import stylesIndex from '../index.module.css'
import styles from './index.module.css'

const networksQuery = graphql`
  query {
    allNetworksMetadataJson {
      edges {
        node {
          chain
          network
          networkId
          chainId
        }
      }
    }
  }
`

function filterChainsByType(
  type: 'mainnet' | 'testnet',
  chainIds: number[],
  networksList: { node: EthereumListsChain }[]
) {
  const finalChains = chainIds.filter((chainId: number) => {
    const networkData = getNetworkDataById(networksList, chainId)

    // HEADS UP! Only networkData.network === 'mainnet' is consistent
    // while not every test network in the network data has 'testnet'
    // in its place. So for the 'testnet' case filter for all non-'mainnet'.
    return type === 'mainnet'
      ? networkData.network === type
      : networkData.network !== 'mainnet'
  })
  return finalChains
}

export default function Chain(): ReactElement {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges

  const { appConfig } = useSiteMetadata()

  const chainsMain = filterChainsByType(
    'mainnet',
    appConfig.chainIdsSupported,
    networksList
  )

  const chainsTest = filterChainsByType(
    'testnet',
    appConfig.chainIdsSupported,
    networksList
  )
  console.log(chainsTest)

  return (
    <Tooltip
      content={
        <ul className={stylesIndex.preferencesDetails}>
          <li>
            <Label htmlFor="chains">Chains</Label>
            <FormHelp>Switch the data source for the interface.</FormHelp>

            <ChainsList title="Main" chains={chainsMain} />
            <ChainsList title="Test" chains={chainsTest} />
          </li>
        </ul>
      }
      trigger="click focus"
      className={`${stylesIndex.preferences} ${styles.chain}`}
    >
      <Network aria-label="Chain" className={stylesIndex.icon} />
      <Caret aria-hidden="true" />
    </Tooltip>
  )
}
