/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PreviousOrder
// ====================================================

export interface PreviousOrder_tokenOrders {
  __typename: 'TokenOrder'
  timestamp: number
  tx: any | null
}

export interface PreviousOrder {
  tokenOrders: PreviousOrder_tokenOrders[]
}

export interface PreviousOrderVariables {
  id: string
  account: string
}
