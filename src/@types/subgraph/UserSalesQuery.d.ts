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
  /**
   * total number of orders made on assets owned by this user
   */
  totalSales: any
}

export interface UserSalesQuery {
  users: UserSalesQuery_users[]
}

export interface UserSalesQueryVariables {
  user: string
}
