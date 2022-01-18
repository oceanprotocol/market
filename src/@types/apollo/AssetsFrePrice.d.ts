/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetsFrePrice
// ====================================================

export interface AssetsFrePrice_fixedRateExchanges_datatoken {
  __typename: 'Datatoken'
  id: string
  address: string
  symbol: string | null
}

export interface AssetsFrePrice_fixedRateExchanges {
  __typename: 'FixedRateExchange'
  rate: any
  id: string
  baseTokenSymbol: string
  datatoken: AssetsFrePrice_fixedRateExchanges_datatoken
}

export interface AssetsFrePrice {
  fixedRateExchanges: AssetsFrePrice_fixedRateExchanges[]
}

export interface AssetsFrePriceVariables {
  datatoken_in?: string[] | null
}
