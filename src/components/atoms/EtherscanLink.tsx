import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { EthereumListsChain, getNetworkData } from '../../utils/web3'
import { ReactComponent as External } from '../../images/external.svg'
import styles from './EtherscanLink.module.css'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { graphql, useStaticQuery } from 'gatsby'

const networksQuery = graphql`
  query {
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

export default function EtherscanLink({
  networkId,
  path,
  children
}: {
  networkId: number
  path: string
  children: ReactNode
}): ReactElement {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges

  const { appConfig } = useSiteMetadata()
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    const networkData = networkId
      ? getNetworkData(networksList, networkId)
      : null
    const url =
      (!networkId && appConfig.network === 'mainnet') || networkId === 1
        ? `https://etherscan.io`
        : `https://${
            networkData ? networkData.network : appConfig.network
          }.etherscan.io`

    setUrl(url)
  }, [networkId, networksList, appConfig.network])

  return (
    <a
      href={`${url}/${path}`}
      title="View on Etherscan"
      target="_blank"
      rel="noreferrer"
      className={styles.link}
    >
      {children} <External />
    </a>
  )
}
