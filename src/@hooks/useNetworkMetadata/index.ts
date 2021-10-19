import { useStaticQuery, graphql } from 'gatsby'
import { UseNetworkMetadata } from './types'

const networksQuery = graphql`
  query {
    allNetworksMetadataJson {
      edges {
        node {
          chain
          network
          networkId
          chainId
          rpc
          explorers {
            url
          }
          nativeCurrency {
            name
            symbol
            decimals
          }
        }
      }
    }
  }
`

export default function useNetworkMetadata(): UseNetworkMetadata {
  const data = useStaticQuery(networksQuery)
  const networksList: { node: EthereumListsChain }[] =
    data.allNetworksMetadataJson.edges

  return { networksList }
}

export * from './utils'
