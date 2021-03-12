import React, { useState, useEffect, ReactElement } from 'react'
import { useOcean } from '../../../providers/Ocean'
import Status from '../../atoms/Status'
import {
  EthereumListsChain,
  getNetworkData,
  getNetworkDisplayName
} from '../../../utils/web3'
import { ConfigHelper } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import styles from './Network.module.css'
import Badge from '../../atoms/Badge'
import Tooltip from '../../atoms/Tooltip'
import { graphql, useStaticQuery } from 'gatsby'
import { useWeb3 } from '../../../providers/Web3'

const networksQuery = graphql`
  query NetworksQuery {
    allNetworksMetadataJson {
      edges {
        node {
          chain
          network
          networkId
          nativeCurrency {
            name
            symbol
          }
        }
      }
    }
  }
`

export default function Network(): ReactElement {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges

  const { networkId } = useWeb3()
  const { config } = useOcean()
  const networkIdConfig = (config as ConfigHelperConfig).networkId

  const [isEthMainnet, setIsEthMainnet] = useState<boolean>()
  const [networkName, setNetworkName] = useState<string>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [isSupportedNetwork, setIsSupportedNetwork] = useState<boolean>()

  useEffect(() => {
    // take network from user when present,
    // otherwise use the default configured one of app
    const network = networkId || networkIdConfig
    const isEthMainnet = network === 1
    setIsEthMainnet(isEthMainnet)

    // Check networkId against ocean.js ConfigHelper configs
    // to figure out if network is supported.
    const isSupportedNetwork = Boolean(new ConfigHelper().getConfig(network))
    setIsSupportedNetwork(isSupportedNetwork)

    // Figure out if we're on a chain's testnet, or not
    const networkData = getNetworkData(networksList, network)
    setIsTestnet(networkData.network !== 'mainnet')

    const networkName = getNetworkDisplayName(networkData, network)
    setNetworkName(networkName)
  }, [networkId, networkIdConfig, networksList])

  return !isEthMainnet && networkName ? (
    <div className={styles.network}>
      {!isSupportedNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      <span className={styles.name}>{networkName}</span>
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
