/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoolData
// ====================================================

export interface PoolData_poolData_baseToken {
  __typename: 'Token'
  address: string
  symbol: string | null
  decimals: number
}

export interface PoolData_poolData_datatoken {
  __typename: 'Token'
  address: string
  symbol: string | null
  decimals: number
}

export interface PoolData_poolData_shares {
  __typename: 'PoolShare'
  shares: any
}

export interface PoolData_poolData {
  __typename: 'Pool'
  /**
   * pool address
   */
  id: string
  /**
   * total pool token shares
   */
  totalShares: any
  /**
   * Liquidty provider fee value
   */
  liquidityProviderSwapFee: any | null
  /**
   * publisher market fee value
   */
  publishMarketSwapFee: any
  spotPrice: any
  baseToken: PoolData_poolData_baseToken
  baseTokenWeight: any
  baseTokenLiquidity: any
  datatoken: PoolData_poolData_datatoken
  datatokenWeight: any
  datatokenLiquidity: any
  shares: PoolData_poolData_shares[] | null
}

export interface PoolData_poolDataUser_shares {
  __typename: 'PoolShare'
  shares: any
}

export interface PoolData_poolDataUser {
  __typename: 'Pool'
  shares: PoolData_poolDataUser_shares[] | null
}

export interface PoolData_poolSnapshots_baseToken {
  __typename: 'Token'
  address: string
  symbol: string | null
  decimals: number
}

export interface PoolData_poolSnapshots_datatoken {
  __typename: 'Token'
  address: string
  symbol: string | null
  decimals: number
}

export interface PoolData_poolSnapshots {
  __typename: 'PoolSnapshot'
  /**
   * date without time
   */
  date: number
  /**
   * last spot price in the 24h interval
   */
  spotPrice: any
  baseTokenLiquidity: any
  datatokenLiquidity: any
  /**
   * swap value 24h
   */
  swapVolume: any
  baseToken: PoolData_poolSnapshots_baseToken
  datatoken: PoolData_poolSnapshots_datatoken
}

export interface PoolData {
  poolData: PoolData_poolData | null
  poolDataUser: PoolData_poolDataUser | null
  poolSnapshots: PoolData_poolSnapshots[]
}

export interface PoolDataVariables {
  pool: string
  poolAsString: string
  owner: string
  user?: string | null
}
