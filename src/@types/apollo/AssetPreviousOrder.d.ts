/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetPreviousOrder
// ====================================================

export interface AssetPreviousOrder_tokenOrders {
  __typename: 'TokenOrder'
  timestamp: number
  tx: any | null
}

export interface AssetPreviousOrder {
  tokenOrders: AssetPreviousOrder_tokenOrders[]
}

export interface AssetPreviousOrderVariables {
  id: string
  account: string
}
