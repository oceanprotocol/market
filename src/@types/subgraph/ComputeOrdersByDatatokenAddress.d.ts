/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ComputeOrdersByDatatokenAddress
// ====================================================

export interface ComputeOrdersByDatatokenAddress_orders_datatoken {
  __typename: "Token";
  address: string;
}

export interface ComputeOrdersByDatatokenAddress_orders {
  __typename: "Order";
  /**
   * transaction hash - token address - from address
   */
  id: string;
  serviceIndex: number;
  datatoken: ComputeOrdersByDatatokenAddress_orders_datatoken;
  tx: string;
  createdTimestamp: number;
}

export interface ComputeOrdersByDatatokenAddress {
  orders: ComputeOrdersByDatatokenAddress_orders[];
}

export interface ComputeOrdersByDatatokenAddressVariables {
  user: string;
  datatokenAddress: string;
}
