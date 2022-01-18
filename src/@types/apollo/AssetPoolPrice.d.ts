/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetPoolPrice
// ====================================================

export interface AssetPoolPrice_pools_tokens {
  __typename: 'PoolToken'
  symbol: string | null
}

export interface AssetPoolPrice_pools {
  __typename: 'Pool'
  id: string
  spotPrice: any
  consumePrice: any
  datatokenAddress: string
  datatokenReserve: any
  oceanReserve: any
  tokens: AssetPoolPrice_pools_tokens[] | null
}

export interface AssetPoolPrice {
  pools: AssetPoolPrice_pools[]
}

export interface AssetPoolPriceVariables {
  datatokenAddress?: string | null
}
