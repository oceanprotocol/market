/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoolShare
// ====================================================

export interface PoolShare_pool_shares {
  __typename: 'PoolShare'
  id: string
  balance: any
}

export interface PoolShare_pool {
  __typename: 'Pool'
  id: string
  shares: PoolShare_pool_shares[] | null
}

export interface PoolShare {
  pool: PoolShare_pool | null
}

export interface PoolShareVariables {
  id: string
  shareId?: string | null
}
