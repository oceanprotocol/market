/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ComputeOrdersByDatatokenAddress
// ====================================================

export interface ComputeOrdersByDatatokenAddress_tokenOrders_datatokenId {
  __typename: 'Datatoken'
  address: string
}

export interface ComputeOrdersByDatatokenAddress_tokenOrders {
  __typename: 'TokenOrder'
  id: string
  serviceId: number
  datatokenId: ComputeOrdersByDatatokenAddress_tokenOrders_datatokenId
  tx: any | null
  timestamp: number
}

export interface ComputeOrdersByDatatokenAddress {
  tokenOrders: ComputeOrdersByDatatokenAddress_tokenOrders[]
}

export interface ComputeOrdersByDatatokenAddressVariables {
  user: string
  datatokenAddress: string
}
