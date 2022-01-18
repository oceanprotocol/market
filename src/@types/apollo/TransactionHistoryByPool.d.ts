/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TransactionHistoryByPool
// ====================================================

export interface TransactionHistoryByPool_poolTransactions_tokens_poolToken {
  __typename: 'PoolToken'
  id: string
  symbol: string | null
}

export interface TransactionHistoryByPool_poolTransactions_tokens {
  __typename: 'PoolTransactionTokenValues'
  poolToken: TransactionHistoryByPool_poolTransactions_tokens_poolToken
  value: any
  type: string
  tokenAddress: string
}

export interface TransactionHistoryByPool_poolTransactions_poolAddress {
  __typename: 'Pool'
  datatokenAddress: string
}

export interface TransactionHistoryByPool_poolTransactions {
  __typename: 'PoolTransaction'
  tokens: TransactionHistoryByPool_poolTransactions_tokens[] | null
  tx: any
  event: string | null
  timestamp: number
  poolAddress: TransactionHistoryByPool_poolTransactions_poolAddress | null
}

export interface TransactionHistoryByPool {
  poolTransactions: TransactionHistoryByPool_poolTransactions[]
}

export interface TransactionHistoryByPoolVariables {
  user?: string | null
  pool?: string | null
}
