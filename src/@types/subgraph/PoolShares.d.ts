/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoolShares
// ====================================================

export interface PoolShares_poolShares_user {
  __typename: 'User'
  id: string
}

export interface PoolShares_poolShares_pool_datatoken {
  __typename: 'Token'
  id: string
  address: string
  symbol: string | null
}

export interface PoolShares_poolShares_pool_baseToken {
  __typename: 'Token'
  id: string
  address: string
  symbol: string | null
}

export interface PoolShares_poolShares_pool {
  __typename: 'Pool'
  /**
   * pool address
   */
  id: string
  datatoken: PoolShares_poolShares_pool_datatoken
  baseToken: PoolShares_poolShares_pool_baseToken
  baseTokenLiquidity: any
  datatokenLiquidity: any
  /**
   * total pool token shares
   */
  totalShares: any
  spotPrice: any
  /**
   * block time when pool was created
   */
  createdTimestamp: number
}

export interface PoolShares_poolShares {
  __typename: 'PoolShare'
  /**
   * poolAddress + userAddress
   */
  id: string
  shares: any
  user: PoolShares_poolShares_user
  pool: PoolShares_poolShares_pool
}

export interface PoolShares {
  poolShares: PoolShares_poolShares[]
}

export interface PoolSharesVariables {
  user?: string | null
}
