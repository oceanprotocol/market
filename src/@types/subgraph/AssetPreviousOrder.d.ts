/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AssetPreviousOrder
// ====================================================

export interface AssetPreviousOrder_orders {
  __typename: 'Order'
  createdTimestamp: number
  tx: string
}

export interface AssetPreviousOrder {
  orders: AssetPreviousOrder_orders[]
}

export interface AssetPreviousOrderVariables {
  id: string
  account: string
}
