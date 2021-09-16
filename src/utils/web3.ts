import { Logger } from '@oceanprotocol/lib'
import { getOceanConfig } from './ocean'

export interface EthereumListsChain {
  name: string
  chainId: number
  shortName: string
  chain: string
  network: string
  networkId: number
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpc: string[]
  faucets: string[]
  infoURL: string
}

export interface NetworkObject {
  chainId: number
  name: string
  urlList: string[]
}

const configGaiaX = getOceanConfig(2021000)

export const networkDataGaiaX = {
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
  infoURL: 'https://www.gaia-x.eu'
}

export function getNetworkConfigObject(node: any): NetworkObject {
  const networkConfig = {
    name: node.chain,
    symbol: node.nativeCurrency.symbol,
    chainId: node.chainId,
    urlList: [node.providerUri]
  }
  return networkConfig
}

export function accountTruncate(account: string): string {
  if (!account) return
  const middle = account.substring(6, 38)
  const truncated = account.replace(middle, '…')
  return truncated
}

export function getNetworkDisplayName(
  data: EthereumListsChain,
  networkId: number
): string {
  let displayName

  switch (networkId) {
    case 1287:
      displayName = 'Moonbase Alpha'
      break
    case 137:
      displayName = 'Polygon'
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
  network: NetworkObject
): Promise<void> {
  const newNewtworkData = {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: network.name,
    rpcUrls: network.urlList
  }
  try {
    await web3Provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newNewtworkData.chainId }]
    })
  } catch (switchError) {
    if (switchError.code === 4902) {
      web3Provider.request(
        {
          method: 'wallet_addEthereumChain',
          params: [newNewtworkData]
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
