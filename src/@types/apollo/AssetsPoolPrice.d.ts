/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetsPoolPrice
// ====================================================

export interface AssetsPoolPrice_pools_tokens {
  __typename: 'PoolToken'
  isDatatoken: boolean
  symbol: string | null
}

export interface AssetsPoolPrice_pools {
  __typename: 'Pool'
  id: string
  spotPrice: any
  consumePrice: any
  datatokenAddress: string
  datatokenReserve: any
  oceanReserve: any
  tokens: AssetsPoolPrice_pools_tokens[] | null
}

export interface AssetsPoolPrice {
  pools: AssetsPoolPrice_pools[]
}

export interface AssetsPoolPriceVariables {
  datatokenAddress_in?: string[] | null
}
