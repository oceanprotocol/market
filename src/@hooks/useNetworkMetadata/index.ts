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
import { useAppKitNetworkCore } from '@reown/appkit/react'

export default function useNetworkMetadata(): UseNetworkMetadata {
  const { appConfig } = useMarketMetadata()
  const { chainId } = useAppKitNetworkCore()

  const [networkDisplayName, setNetworkDisplayName] = useState<string>()
  const [networkData, setNetworkData] = useState<EthereumListsChain>()
  const [isTestnet, setIsTestnet] = useState<boolean>()
  const [isSupportedOceanNetwork, setIsSupportedOceanNetwork] = useState(true)

  const networksList: EthereumListsChain[] = networkdata

  // -----------------------------------
  // Get and set network metadata
  // -----------------------------------
  useEffect(() => {
    if (!chainId) return

    const networkData = getNetworkDataById(networksList, Number(chainId))
    setNetworkData(networkData)

    // Construct network display name
    const networkDisplayName = getNetworkDisplayName(networkData)
    setNetworkDisplayName(networkDisplayName)

    // Check if network is supported by Ocean Protocol
    if (appConfig.chainIdsSupported.includes(Number(chainId))) {
      setIsSupportedOceanNetwork(true)
    } else {
      setIsSupportedOceanNetwork(false)
    }

    // Check if network is testnet
    setIsTestnet(getNetworkType(networkData) !== NetworkType.Mainnet)
  }, [chainId, networksList, appConfig.chainIdsSupported])

  return {
    networksList,
    networkDisplayName,
    networkData,
    isTestnet,
    isSupportedOceanNetwork
  }
}

export * from './utils'
