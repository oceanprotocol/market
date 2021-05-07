import { Logger, ConfigHelperConfig } from '@oceanprotocol/lib'

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
  const displayName = data
    ? `${data.chain} ${data.network === 'mainnet' ? '' : data.network}`
    : networkId === 8996
    ? 'Development'
    : 'Unknown'

  return displayName
}

export function getNetworkData(
  data: { node: EthereumListsChain }[],
  networkId: number
): EthereumListsChain {
  const networkData = data.filter(
    ({ node }: { node: EthereumListsChain }) => node.networkId === networkId
  )[0]
  return networkData.node
}

export function addCustomNetwork(
  web3Provider: any,
  network: NetworkObject
): void {
  const newNewtworkData = {
    chainId: `0x${network.chainId.toString(16)}`,
    chainName: network.name,
    rpcUrls: network.urlList
  }
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
          }) netowrk to MetaMask, error: ${err || added.error}`
        )
      } else {
        Logger.log(
          `Added ${network.name} (0x${network.chainId}) network to MetaMask`
        )
      }
    }
  )
}

export function addOceanToWallet(
  config: ConfigHelperConfig,
  web3Provider: any
): void {
  const tokenMetadata = {
    type: 'ERC20',
    options: {
      address: config.oceanTokenAddress,
      symbol: config.oceanTokenSymbol,
      decimals: 18,
      image:
        'https://raw.githubusercontent.com/oceanprotocol/art/main/logo/token.png'
    }
  }
  web3Provider.sendAsync(
    {
      method: 'wallet_watchAsset',
      params: tokenMetadata,
      id: Math.round(Math.random() * 100000)
    },
    (err: string, added: any) => {
      if (err || 'error' in added) {
        Logger.error(
          `Couldn't add ${tokenMetadata.options.symbol} (${
            tokenMetadata.options.address
          }) to MetaMask, error: ${err || added.error}`
        )
      } else {
        Logger.log(
          `Added ${tokenMetadata.options.symbol} (${tokenMetadata.options.address}) to MetaMask`
        )
      }
    }
  )
}
