/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OrdersData
// ====================================================

export interface OrdersData_orders_consumer {
  __typename: 'User'
  id: string
}

export interface OrdersData_orders_datatoken {
  __typename: 'Token'
  id: string
  address: string
  symbol: string | null
}

export interface OrdersData_orders_consumerMarketToken {
  __typename: 'Token'
  address: string
  symbol: string | null
}

export interface OrdersData_orders {
  __typename: 'Order'
  consumer: OrdersData_orders_consumer
  datatoken: OrdersData_orders_datatoken
  consumerMarketToken: OrdersData_orders_consumerMarketToken | null
  createdTimestamp: number
  tx: string
}

export interface OrdersData {
  orders: OrdersData_orders[]
}

export interface OrdersDataVariables {
  user: string
}
