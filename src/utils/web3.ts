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
