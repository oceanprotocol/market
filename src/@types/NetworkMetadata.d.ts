interface EthereumListsChain {
  name: string
  chainId: number
  shortName: string
  chain: string
  network: string
  networkId: number
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpc: string[]
  infoURL: string
  faucets: string[]
  explorers?: { name: string; url: string; standard: string }[]
}

interface NetworkObject {
  chainId: number
  name: string
  nativeCurrency: string
  explorers: [{ url: string }]
  urlList: string[]
}
