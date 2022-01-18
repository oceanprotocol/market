/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetsFreePrice
// ====================================================

export interface AssetsFreePrice_dispensers_datatoken {
  __typename: 'Datatoken'
  id: string
  address: string
}

export interface AssetsFreePrice_dispensers {
  __typename: 'Dispenser'
  datatoken: AssetsFreePrice_dispensers_datatoken
}

export interface AssetsFreePrice {
  dispensers: AssetsFreePrice_dispensers[]
}

export interface AssetsFreePriceVariables {
  datatoken_in?: string[] | null
}
