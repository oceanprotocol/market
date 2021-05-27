import { graphql, useStaticQuery } from 'gatsby'
import React, { FunctionComponent, ReactElement } from 'react'
import { ReactComponent as EthIcon } from '../../images/eth.svg'
import { ReactComponent as PolygonIcon } from '../../images/polygon.svg'
import { ReactComponent as MoonbeamIcon } from '../../images/moonbeam.svg'
import {
  EthereumListsChain,
  getNetworkData,
  getNetworkDisplayName
} from '../../utils/web3'
import styles from './NetworkName.module.css'

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
} = { ETH: EthIcon, Polygon: PolygonIcon, Moonbeam: MoonbeamIcon }

export function NetworkIcon({ name }: { name: string }): ReactElement {
  const IconMapped = name.includes('ETH')
    ? icons.ETH
    : name.includes('Polygon')
    ? icons.Polygon
    : name.includes('Moon')
    ? icons.Moonbeam
    : icons[name.trim()]

  return IconMapped ? <IconMapped className={styles.icon} /> : null
}

export default function NetworkName({
  networkId,
  minimal,
  className
}: {
  networkId: number
  minimal?: boolean
  className?: string
}): ReactElement {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges
  const networkData = getNetworkData(networksList, networkId)
  const networkName = getNetworkDisplayName(networkData, networkId)

  return (
    <span
      className={`${styles.network} ${className || ''}`}
      title={minimal ? networkName : null}
    >
      <NetworkIcon name={networkName} /> {!minimal && networkName}
    </span>
  )
}
