export interface StatsValue {
  [chainId: number]: string
}

export interface StatsTotal {
  totalValueLockedInOcean: number
  totalOceanLiquidity: number
  pools: number
  nfts: number
  datatokens: number
  orders: number
}
