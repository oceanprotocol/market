/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSalesQuery
// ====================================================

export interface UserSalesQuery_users {
  __typename: 'User'
  id: string
  nrSales: number | null
}

export interface UserSalesQuery {
  users: UserSalesQuery_users[]
}

export interface UserSalesQueryVariables {
  userSalesId?: string | null
}
