/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetFrePrice
// ====================================================

export interface AssetFrePrice_fixedRateExchanges_datatoken {
  __typename: 'Datatoken'
  id: string
  address: string
  symbol: string | null
}

export interface AssetFrePrice_fixedRateExchanges {
  __typename: 'FixedRateExchange'
  rate: any
  id: string
  baseTokenSymbol: string
  datatoken: AssetFrePrice_fixedRateExchanges_datatoken
}

export interface AssetFrePrice {
  fixedRateExchanges: AssetFrePrice_fixedRateExchanges[]
}

export interface AssetFrePriceVariables {
  datatoken?: string | null
}
