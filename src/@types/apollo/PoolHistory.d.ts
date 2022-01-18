/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoolHistory
// ====================================================

export interface PoolHistory_poolTransactions {
  __typename: 'PoolTransaction'
  block: number
  spotPrice: any
  timestamp: number
  oceanReserve: any
}

export interface PoolHistory {
  poolTransactions: PoolHistory_poolTransactions[]
}

export interface PoolHistoryVariables {
  id: string
  block?: number | null
}
