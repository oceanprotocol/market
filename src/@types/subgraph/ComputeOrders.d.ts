/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ComputeOrders
// ====================================================

export interface ComputeOrders_orders_datatoken {
  __typename: "Token";
  address: string;
}

export interface ComputeOrders_orders {
  __typename: "Order";
  /**
   * transaction hash - token address - from address
   */
  id: string;
  serviceIndex: number;
  datatoken: ComputeOrders_orders_datatoken;
  tx: string;
  createdTimestamp: number;
}

export interface ComputeOrders {
  orders: ComputeOrders_orders[];
}

export interface ComputeOrdersVariables {
  user: string;
}
