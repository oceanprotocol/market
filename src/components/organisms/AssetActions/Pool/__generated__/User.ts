/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user_tokenBalancesOwned {
  __typename: "TokenBalance";
  id: string;
}

export interface User_user_sharesOwned_poolId {
  __typename: "Pool";
  id: string;
}

export interface User_user_sharesOwned {
  __typename: "PoolShare";
  id: string;
  poolId: User_user_sharesOwned_poolId;
  balance: any;
}

export interface User_user {
  __typename: "User";
  id: string;
  tokenBalancesOwned: User_user_tokenBalancesOwned[] | null;
  sharesOwned: User_user_sharesOwned[] | null;
}

export interface User {
  user: User_user | null;
}

export interface UserVariables {
  id: string;
}
