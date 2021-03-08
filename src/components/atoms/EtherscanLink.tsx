import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { EthereumListsChain, getNetworkData } from '../../utils/wallet'
import { ReactComponent as External } from '../../images/external.svg'
import styles from './EtherscanLink.module.css'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { graphql, useStaticQuery } from 'gatsby'
import { useOcean } from '@oceanprotocol/react'
import { ConfigHelperConfig } from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

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
  const { config } = useOcean()
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    setUrl((config as ConfigHelperConfig).explorerUri)
  }, [config])

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
