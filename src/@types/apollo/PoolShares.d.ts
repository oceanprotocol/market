/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoolShares
// ====================================================

export interface PoolShares_poolShares_userAddress {
  __typename: 'User'
  id: string
}

export interface PoolShares_poolShares_poolId_tokens {
  __typename: 'PoolToken'
  id: string
  isDatatoken: boolean
  symbol: string | null
}

export interface PoolShares_poolShares_poolId {
  __typename: 'Pool'
  id: string
  datatokenAddress: string
  valueLocked: any
  tokens: PoolShares_poolShares_poolId_tokens[] | null
  oceanReserve: any
  datatokenReserve: any
  totalShares: any
  consumePrice: any
  spotPrice: any
  createTime: number
}

export interface PoolShares_poolShares {
  __typename: 'PoolShare'
  id: string
  balance: any
  userAddress: PoolShares_poolShares_userAddress
  poolId: PoolShares_poolShares_poolId
}

export interface PoolShares {
  poolShares: PoolShares_poolShares[]
}

export interface PoolSharesVariables {
  user?: string | null
}
