/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TopSalesQuery
// ====================================================

export interface TopSalesQuery_users {
  __typename: 'User'
  id: string
  /**
   * total number of orders made on assets owned by this user
   */
  totalSales: any
}

export interface TopSalesQuery {
  users: TopSalesQuery_users[]
}
