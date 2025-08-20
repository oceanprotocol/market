/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSharesQuery
// ====================================================

export interface UserSharesQuery_poolShares_user {
  __typename: 'User'
  id: string
}

export interface UserSharesQuery_poolShares_pool_datatoken {
  __typename: 'Token'
  address: string
  symbol: string | null
}

export interface UserSharesQuery_poolShares_pool_baseToken {
  __typename: 'Token'
  address: string
  symbol: string | null
}

export interface UserSharesQuery_poolShares_pool {
  __typename: 'Pool'
  /**
   * pool address
   */
  id: string
  datatoken: UserSharesQuery_poolShares_pool_datatoken
  baseToken: UserSharesQuery_poolShares_pool_baseToken
  datatokenLiquidity: any
  baseTokenLiquidity: any
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

export interface UserSharesQuery_poolShares {
  __typename: 'PoolShare'
  /**
   * poolAddress + userAddress
   */
  id: string
  shares: any
  user: UserSharesQuery_poolShares_user
  pool: UserSharesQuery_poolShares_pool
}

export interface UserSharesQuery {
  poolShares: UserSharesQuery_poolShares[]
}

export interface UserSharesQueryVariables {
  user?: string | null
  pools?: string[] | null
}
