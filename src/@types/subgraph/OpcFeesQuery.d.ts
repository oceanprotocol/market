/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OpcFeesQuery
// ====================================================

export interface OpcFeesQuery_opc {
  __typename: 'OPC'
  /**
   * fee in percent for swaps involving OPC approved tokens
   */
  swapOceanFee: any | null
  /**
   * fee in percent for swaps involving non OPC approved tokens
   */
  swapNonOceanFee: any | null
  /**
   * fee in percent taken by OPC from orderFees
   */
  orderFee: any | null
  /**
   * fee in percent taken by OPC from providerFees
   */
  providerFee: any | null
}

export interface OpcFeesQuery {
  opc: OpcFeesQuery_opc | null
}

export interface OpcFeesQueryVariables {
  id: string
}
