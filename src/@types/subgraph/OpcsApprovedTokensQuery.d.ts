/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OpcsApprovedTokensQuery
// ====================================================

export interface OpcsApprovedTokensQuery_opcs_approvedTokens {
  __typename: "Token";
  address: string;
  symbol: string | null;
  name: string | null;
  decimals: number;
}

export interface OpcsApprovedTokensQuery_opcs {
  __typename: "OPC";
  approvedTokens: OpcsApprovedTokensQuery_opcs_approvedTokens[] | null;
}

export interface OpcsApprovedTokensQuery {
  opcs: OpcsApprovedTokensQuery_opcs[];
}
