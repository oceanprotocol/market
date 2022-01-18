/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserSharesQuery
// ====================================================

export interface UserSharesQuery_poolShares_userAddress {
  __typename: 'User'
  id: string
}

export interface UserSharesQuery_poolShares_poolId_tokens_tokenId {
  __typename: 'Datatoken'
  symbol: string | null
}

export interface UserSharesQuery_poolShares_poolId_tokens {
  __typename: 'PoolToken'
  tokenId: UserSharesQuery_poolShares_poolId_tokens_tokenId | null
}

export interface UserSharesQuery_poolShares_poolId {
  __typename: 'Pool'
  id: string
  datatokenAddress: string
  valueLocked: any
  tokens: UserSharesQuery_poolShares_poolId_tokens[] | null
  oceanReserve: any
  datatokenReserve: any
  totalShares: any
  consumePrice: any
  spotPrice: any
  createTime: number
}

export interface UserSharesQuery_poolShares {
  __typename: 'PoolShare'
  id: string
  balance: any
  userAddress: UserSharesQuery_poolShares_userAddress
  poolId: UserSharesQuery_poolShares_poolId
}

export interface UserSharesQuery {
  poolShares: UserSharesQuery_poolShares[]
}

export interface UserSharesQueryVariables {
  user?: string | null
  pools?: string[] | null
}
