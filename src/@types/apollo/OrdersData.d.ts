/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrdersData
// ====================================================

export interface OrdersData_tokenOrders_datatokenId {
  __typename: 'Datatoken'
  address: string
  symbol: string | null
}

export interface OrdersData_tokenOrders {
  __typename: 'TokenOrder'
  datatokenId: OrdersData_tokenOrders_datatokenId
  timestamp: number
  tx: any | null
}

export interface OrdersData {
  tokenOrders: OrdersData_tokenOrders[]
}

export interface OrdersDataVariables {
  user: string
}
