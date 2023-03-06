import { networkDataGaiaX } from './constants'

export enum NetworkType {
  Mainnet = 'mainnet',
  Testnet = 'testnet'
}

export function getNetworkType(network: EthereumListsChain): string {
  // HEADS UP! Hack for getting network's type main/test, without using
  // .network field, which is innexistent on https://chainid.network/chains.json
  // We hack in mainnet detection for moonriver.
  if (
    network &&
    !network.name?.includes('Testnet') &&
    !network.title?.includes('Testnet')
  ) {
    return NetworkType.Mainnet
  } else {
    return NetworkType.Testnet
  }
}

export function getNetworkDisplayName(data: EthereumListsChain): string {
  let displayName
  if (!data) return 'Unknown'

  switch (data?.chainId) {
    case 137:
      displayName = 'Polygon'
      break
    case 1285:
      displayName = 'Moonriver'
      break
    case 80001:
      displayName = 'Mumbai'
      break
    case 8996:
      displayName = 'Development'
      break
    case 5:
      displayName = 'Görli'
      break
    case 2021000:
      displayName = 'GAIA-X'
      break
    default:
      displayName = data
        ? `${data.chain}${
            getNetworkType(data) === 'mainnet' ? '' : ` ${data.name}`
          }`
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
    return type === getNetworkType(networkData)
  })
  return finalNetworks
}
