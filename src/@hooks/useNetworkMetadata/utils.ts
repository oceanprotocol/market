import { networkDataGaiaX } from './constants'

export function getNetworkDisplayName(
  data: EthereumListsChain,
  networkId: number
): string {
  let displayName

  switch (networkId) {
    case 137:
      displayName = 'Polygon'
      break
    case 1287:
      displayName = 'Moonbase Alpha'
      break
    case 1285:
      displayName = 'Moonriver'
      break
    case 80001:
      displayName = 'Polygon Mumbai'
      break
    case 8996:
      displayName = 'Development'
      break
    default:
      displayName = data
        ? `${data.chain} ${data.network === 'mainnet' ? '' : data.network}`
        : 'Unknown'
      break
  }

  return displayName
}

export function getNetworkDataById(
  data: EthereumListsChain[],
  networkId: number
): EthereumListsChain {
  if (!networkId) return
  const networkData = data.filter(
    (chain: EthereumListsChain) => chain.chainId === networkId
  )

  return networkId === 2021000 ? networkDataGaiaX : networkData[0]
}

export function filterNetworksByType(
  type: 'mainnet' | 'testnet',
  chainIds: number[],
  networksList: EthereumListsChain[]
): number[] {
  const finalNetworks = chainIds.filter((chainId: number) => {
    const networkData = getNetworkDataById(networksList, chainId)

    // HEADS UP! Only networkData.network === 'mainnet' is consistent
    // while not every test network in the network data has 'testnet'
    // in its place. So for the 'testnet' case filter for all non-'mainnet'.
    //
    // HEADS UP NO. 2! We hack in mainnet detection for moonriver as their
    // network data uses the `network` key wrong over in
    // https://github.com/ethereum-lists/chains/blob/master/_data/chains/eip155-1285.json
    //
    return type === 'mainnet'
      ? networkData.network === type || networkData.network === 'moonriver'
      : networkData.network !== 'mainnet' && networkData.network !== 'moonriver'
  })
  return finalNetworks
}
