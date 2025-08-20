/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HighestLiquidityAssets
// ====================================================

export interface HighestLiquidityAssets_pools_datatoken {
  __typename: 'Token'
  address: string
}

export interface HighestLiquidityAssets_pools_baseToken {
  __typename: 'Token'
  symbol: string | null
}

export interface HighestLiquidityAssets_pools {
  __typename: 'Pool'
  /**
   * pool address
   */
  id: string
  datatoken: HighestLiquidityAssets_pools_datatoken
  baseToken: HighestLiquidityAssets_pools_baseToken
  baseTokenLiquidity: any
  datatokenLiquidity: any
}

export interface HighestLiquidityAssets {
  pools: HighestLiquidityAssets_pools[]
}
