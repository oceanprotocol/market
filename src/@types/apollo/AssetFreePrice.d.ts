/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetFreePrice
// ====================================================

export interface AssetFreePrice_dispensers_owner {
  __typename: 'User'
  id: string
}

export interface AssetFreePrice_dispensers_datatoken {
  __typename: 'Datatoken'
  id: string
}

export interface AssetFreePrice_dispensers {
  __typename: 'Dispenser'
  active: boolean
  owner: AssetFreePrice_dispensers_owner
  minterApproved: boolean
  isTrueMinter: boolean
  maxTokens: any
  maxBalance: any
  balance: any
  datatoken: AssetFreePrice_dispensers_datatoken
}

export interface AssetFreePrice {
  dispensers: AssetFreePrice_dispensers[]
}

export interface AssetFreePriceVariables {
  datatoken?: string | null
}
