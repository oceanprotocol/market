/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TransactionHistory
// ====================================================

export interface TransactionHistory_poolTransactions_tokens_poolToken {
  __typename: 'PoolToken'
  id: string
  symbol: string | null
}

export interface TransactionHistory_poolTransactions_tokens {
  __typename: 'PoolTransactionTokenValues'
  poolToken: TransactionHistory_poolTransactions_tokens_poolToken
  value: any
  type: string
  tokenAddress: string
}

export interface TransactionHistory_poolTransactions_poolAddress {
  __typename: 'Pool'
  datatokenAddress: string
}

export interface TransactionHistory_poolTransactions {
  __typename: 'PoolTransaction'
  tokens: TransactionHistory_poolTransactions_tokens[] | null
  tx: any
  event: string | null
  timestamp: number
  poolAddress: TransactionHistory_poolTransactions_poolAddress | null
}

export interface TransactionHistory {
  poolTransactions: TransactionHistory_poolTransactions[]
}

export interface TransactionHistoryVariables {
  user?: string | null
}
