/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OpcQuery
// ====================================================

export interface OpcQuery_opc_approvedTokens {
  __typename: "Token";
  address: string;
  symbol: string | null;
  name: string | null;
  decimals: number;
}

export interface OpcQuery_opc {
  __typename: "OPC";
  /**
   * fee in percent for swaps involving OPC approved tokens
   */
  swapOceanFee: any | null;
  /**
   * fee in percent for swaps involving non OPC approved tokens
   */
  swapNonOceanFee: any | null;
  approvedTokens: OpcQuery_opc_approvedTokens[] | null;
  id: string;
}

export interface OpcQuery {
  opc: OpcQuery_opc | null;
}
