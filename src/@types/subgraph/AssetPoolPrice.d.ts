/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetPoolPrice
// ====================================================

export interface AssetPoolPrice_pools_datatoken {
  __typename: 'Token'
  address: string
  symbol: string | null
}

export interface AssetPoolPrice_pools_baseToken {
  __typename: 'Token'
  symbol: string | null
}

export interface AssetPoolPrice_pools {
  __typename: 'Pool'
  /**
   * pool address
   */
  id: string
  spotPrice: any
  datatoken: AssetPoolPrice_pools_datatoken
  baseToken: AssetPoolPrice_pools_baseToken
  datatokenLiquidity: any
  baseTokenLiquidity: any
}

export interface AssetPoolPrice {
  pools: AssetPoolPrice_pools[]
}

export interface AssetPoolPriceVariables {
  datatokenAddress?: string | null
}
