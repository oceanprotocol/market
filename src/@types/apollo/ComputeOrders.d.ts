/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ComputeOrders
// ====================================================

export interface ComputeOrders_tokenOrders_datatokenId {
  __typename: 'Datatoken'
  address: string
}

export interface ComputeOrders_tokenOrders {
  __typename: 'TokenOrder'
  id: string
  serviceId: number
  datatokenId: ComputeOrders_tokenOrders_datatokenId
  tx: any | null
  timestamp: number
}

export interface ComputeOrders {
  tokenOrders: ComputeOrders_tokenOrders[]
}

export interface ComputeOrdersVariables {
  user: string
}
