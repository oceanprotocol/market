import { graphql, useStaticQuery } from 'gatsby'
import React, { FunctionComponent, ReactElement } from 'react'
import { ReactComponent as EthIcon } from '../../images/eth.svg'
import { ReactComponent as PolygonIcon } from '../../images/polygon.svg'
import {
  EthereumListsChain,
  getNetworkData,
  getNetworkDisplayName
} from '../../utils/web3'
import styles from './Network.module.css'

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

const icons: {
  [key: string]: FunctionComponent<React.SVGProps<SVGSVGElement>>
} = { ETH: EthIcon, Matic: PolygonIcon }

export function NetworkIcon({ name }: { name: string }): ReactElement {
  const IconMapped = name.includes('ETH') ? icons.ETH : icons[name.trim()]

  return IconMapped ? <IconMapped className={styles.icon} /> : null
}

export default function Network({
  networkId,
  className
}: {
  networkId: number
  className?: string
}): ReactElement {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges
  const networkData = getNetworkData(networksList, networkId)
  const networkName = getNetworkDisplayName(networkData, networkId)

  return (
    <span className={`${styles.network} ${className || ''}`}>
      <NetworkIcon name={networkName} /> {networkName}
    </span>
  )
}
