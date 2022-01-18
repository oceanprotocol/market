/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoolLiquidity
// ====================================================

export interface PoolLiquidity_pool_tokens {
  __typename: 'PoolToken'
  address: string | null
  symbol: string | null
  isDatatoken: boolean
  balance: any
  denormWeight: any
}

export interface PoolLiquidity_pool_shares {
  __typename: 'PoolShare'
  id: string
  balance: any
}

export interface PoolLiquidity_pool {
  __typename: 'Pool'
  id: string
  totalShares: any
  swapFee: any
  spotPrice: any
  tokens: PoolLiquidity_pool_tokens[] | null
  shares: PoolLiquidity_pool_shares[] | null
}

export interface PoolLiquidity {
  pool: PoolLiquidity_pool | null
}

export interface PoolLiquidityVariables {
  id: string
  shareId?: string | null
}
