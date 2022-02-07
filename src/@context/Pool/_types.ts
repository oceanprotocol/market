import Decimal from 'decimal.js'
import {
  PoolData_poolSnapshots as PoolDataPoolSnapshots,
  PoolData_poolData as PoolDataPoolData
} from 'src/@types/subgraph/PoolData'

export interface PoolInfo {
  poolFee: string
  marketFee: string
  opfFee: string
  weightBaseToken: string
  weightDt: string
  datatokenSymbol: string
  baseTokenSymbol: string
  baseTokenAddress: string
  totalPoolTokens: string
  totalLiquidityInOcean: Decimal
}

export interface PoolInfoUser {
  liquidity: Decimal // liquidity in base token
  poolShares: string // pool share tokens
  poolShare: string // in %
}

export interface PoolProviderValue {
  poolData: PoolDataPoolData
  poolInfo: PoolInfo
  poolInfoOwner: PoolInfoUser
  poolInfoUser: PoolInfoUser
  poolSnapshots: PoolDataPoolSnapshots[]
  hasUserAddedLiquidity: boolean
  isRemoveDisabled: boolean
  refreshInterval: number
  fetchAllData: () => void
}
