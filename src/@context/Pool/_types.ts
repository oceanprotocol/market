import {
  PoolData_poolSnapshots as PoolDataPoolSnapshots,
  PoolData_poolData as PoolDataPoolData
} from 'src/@types/subgraph/PoolData'

export interface PoolInfo {
  liquidityProviderSwapFee: string
  publishMarketSwapFee: string
  weightBaseToken: string
  weightDt: string
  datatokenSymbol: string
  datatokenAddress: string
  baseTokenSymbol: string
  baseTokenAddress: string
  totalPoolTokens: string
}

export interface PoolInfoUser {
  liquidity: string
  poolShares: string
  poolSharePercentage: string
}

export interface PoolProviderValue {
  poolData: PoolDataPoolData
  poolInfo: PoolInfo
  poolInfoOwner: PoolInfoUser
  poolInfoUser: PoolInfoUser
  poolSnapshots: PoolDataPoolSnapshots[]
  hasUserAddedLiquidity: boolean
  refreshInterval: number
  fetchAllData: () => void
}
