import { UseNetworkMetadata } from './types'
import networkdata from '../../../content/networks-metadata.json'

export default function useNetworkMetadata(): UseNetworkMetadata {
  const networksList: EthereumListsChain[] = networkdata
  return { networksList }
}

export * from './utils'
