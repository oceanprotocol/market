import { Logger } from '@oceanprotocol/lib'
import { getOceanConfig } from './ocean'

export interface EthereumListsChain {
  name: string
  title?: string
  chainId: number
  shortName: string
  chain: string
  network: string
  networkId: number
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpc: string[]
  infoURL: string
  faucets: string[]
  explorers: [{ url: string }]
}

export interface NetworkObject {
  chainId: number
  name: string
  nativeCurrency: string
  explorers: [{ url: string }]
  urlList: string[]
}

const configGaiaX = getOceanConfig(2021000)

export const networkDataGaiaX: EthereumListsChain = {
  name: 'GAIA-X Testnet',
  chainId: 2021000,
  shortName: 'GAIA-X',
  chain: 'GAIA-X',
  network: 'testnet',
  networkId: 2021000,
  nativeCurrency: { name: 'Gaia-X', symbol: 'GX', decimals: 18 },
  rpc: [configGaiaX.nodeUri],
  faucets: [
    'https://faucet.gaiaxtestnet.oceanprotocol.com/',
    'https://faucet.gx.gaiaxtestnet.oceanprotocol.com/'
  ],
  infoURL: 'https://www.gaia-x.eu',
  explorers: [{ url: '' }]
}

export function accountTruncate(account: string): string {
  if (!account) return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export function getNetworkType(network: EthereumListsChain): string {
  // HEADS UP! Hack for getting network's type main/test, without using
  // .network field, which is innexistent on https://chainid.network/chains.json
  // We hack in mainnet detection for moonriver.

  if (
    !network.name.includes('Testnet') &&
    !network.title?.includes('Testnet') &&
    network.name !== 'Moonbase Alpha'
  ) {
    return 'mainnet'
  } else {
    return 'testnet'
  }
}

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
    case 3:
      displayName = 'ETH Ropsten'
      break
    case 2021000:
      displayName = 'GAIA-X Testnet'
      break
    default:
      displayName = data
        ? `${data.chain} ${getNetworkType(data) === 'mainnet' ? '' : data.name}`
        : 'Unknown'
      break
  }

  return displayName
}

export function getNetworkDataById(
  data: { node: EthereumListsChain }[],
  networkId: number
): EthereumListsChain {
  if (!networkId) return
  const networkData = data.filter(
    ({ node }: { node: EthereumListsChain }) => node.chainId === networkId
  )

  return networkId === 2021000 ? networkDataGaiaX : networkData[0]?.node
}

export async function addCustomNetwork(
  web3Provider: any,
  network: EthereumListsChain
): Promise<void> {
  // Always add explorer URL from ocean.js first, as it's null sometimes
  // in network data
  const blockExplorerUrls = [
    getOceanConfig(network.networkId).explorerUri,
    network.explorers && network.explorers[0].url
  ]

  const newNetworkData = {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: getNetworkDisplayName(network, network.chainId),
    nativeCurrency: network.nativeCurrency,
    rpcUrls: network.rpc,
    blockExplorerUrls
  }
  try {
    await web3Provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newNetworkData.chainId }]
    })
  } catch (switchError) {
    if (switchError.code === 4902) {
      await web3Provider.request(
        {
          method: 'wallet_addEthereumChain',
          params: [newNetworkData]
        },
        (err: string, added: any) => {
          if (err || 'error' in added) {
            Logger.error(
              `Couldn't add ${network.name} (0x${
                network.chainId
              }) network to MetaMask, error: ${err || added.error}`
            )
          } else {
            Logger.log(
              `Added ${network.name} (0x${network.chainId}) network to MetaMask`
            )
          }
        }
      )
    } else {
      Logger.error(
        `Couldn't add ${network.name} (0x${network.chainId}) network to MetaMask, error: ${switchError}`
      )
    }
  }
  Logger.log(`Added ${network.name} (0x${network.chainId}) network to MetaMask`)
}

export async function addTokenToWallet(
  web3Provider: any,
  address: string,
  symbol: string,
  logo?: string
): Promise<void> {
  const image =
    logo ||
    'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png'

  const tokenMetadata = {
    type: 'ERC20',
    options: { address, symbol, image, decimals: 18 }
  }

  web3Provider.sendAsync(
    {
      method: 'wallet_watchAsset',
      params: tokenMetadata,
      id: Math.round(Math.random() * 100000)
    },
    (err: { code: number; message: string }, added: any) => {
      if (err || 'error' in added) {
        Logger.error(
          `Couldn't add ${tokenMetadata.options.symbol} (${
            tokenMetadata.options.address
          }) to MetaMask, error: ${err.message || added.error}`
        )
      } else {
        Logger.log(
          `Added ${tokenMetadata.options.symbol} (${tokenMetadata.options.address}) to MetaMask`
        )
      }
    }
  )
}
