import { useStaticQuery, graphql } from 'gatsby'
import { EthereumListsChain } from '../utils/web3'

export interface UseNetworkMetadata {
  networksList: { node: EthereumListsChain }[]
}

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
