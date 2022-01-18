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
  nrSales: number | null
}

export interface TopSalesQuery {
  users: TopSalesQuery_users[]
}
