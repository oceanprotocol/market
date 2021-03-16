import React, { useState, useEffect, ReactElement } from 'react'
import { useOcean } from '@oceanprotocol/react'
import Status from '../../atoms/Status'
import {
  EthereumListsChain,
  getNetworkData,
  getNetworkDisplayName
} from '../../../utils/wallet'
import { ConfigHelper } from '@oceanprotocol/lib'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'
import styles from './Network.module.css'
import Badge from '../../atoms/Badge'
import Tooltip from '../../atoms/Tooltip'
import { graphql, useStaticQuery } from 'gatsby'

const networksQuery = graphql`
  query NetworksQuery {
    allNetworksMetadataJson {
      edges {
        node {
          chain
          network
          networkId
        }
      }
    }
  }
`

export default function Network({
  networkName,
  setNetworkName
}: {
  networkName: string
  setNetworkName: (name: string) => void
}): ReactElement {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges

  const { config, networkId } = useOcean()
  const networkIdConfig = (config as ConfigHelperConfig).networkId

  const [isEthMainnet, setIsEthMainnet] = useState<boolean>()
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
