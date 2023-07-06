import { UseNetworkMetadata } from './types'
import networkdata from '../../../content/networks-metadata.json'
import { useEffect, useState } from 'react'
import {
  getNetworkDataById,
  getNetworkDisplayName,
  getNetworkType,
  NetworkType
} from './utils'
import { useMarketMetadata } from '@context/MarketMetadata'
import { useNetwork } from 'wagmi'

export default function useNetworkMetadata(): UseNetworkMetadata {
  const { appConfig } = useMarketMetadata()
  const { chain } = useNetwork()

  const [networkDisplayName, setNetworkDisplayName] = useState<string>()
  const [networkData, setNetworkData] = useState<EthereumListsChain>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [isSupportedOceanNetwork, setIsSupportedOceanNetwork] = useState(true)

  const networksList: EthereumListsChain[] = networkdata

  // -----------------------------------
  // Get and set network metadata
  // -----------------------------------
  useEffect(() => {
    if (!chain?.id) return

    const networkData = getNetworkDataById(networksList, chain.id)
    setNetworkData(networkData)

    // Construct network display name
    const networkDisplayName = getNetworkDisplayName(networkData)
    setNetworkDisplayName(networkDisplayName)

    // Check if network is supported by Ocean Protocol
    if (appConfig.chainIdsSupported.includes(chain.id)) {
      setIsSupportedOceanNetwork(true)
    } else {
      setIsSupportedOceanNetwork(false)
    }

    // Check if network is testnet
    setIsTestnet(getNetworkType(networkData) !== NetworkType.Mainnet)
  }, [chain?.id, networksList, appConfig.chainIdsSupported])

  return {
    networksList,
    networkDisplayName,
    networkData,
    isTestnet,
    isSupportedOceanNetwork
  }
}

export * from './utils'
