/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PoolTransactionType } from './globalTypes'

// ====================================================
// GraphQL query operation: TransactionHistory
// ====================================================

export interface TransactionHistory_poolTransactions_baseToken {
  __typename: 'Token'
  symbol: string | null
  address: string
}

export interface TransactionHistory_poolTransactions_datatoken {
  __typename: 'Token'
  symbol: string | null
  address: string
}

export interface TransactionHistory_poolTransactions_pool_datatoken {
  __typename: 'Token'
  id: string
}

export interface TransactionHistory_poolTransactions_pool {
  __typename: 'Pool'
  datatoken: TransactionHistory_poolTransactions_pool_datatoken
  /**
   * pool address
   */
  id: string
}

export interface TransactionHistory_poolTransactions {
  __typename: 'PoolTransaction'
  /**
   * base tokens transfered
   */
  baseToken: TransactionHistory_poolTransactions_baseToken | null
  /**
   * number of base tokens transfered, for type SWAP if value is negative it means it was removed
   */
  baseTokenValue: any | null
  /**
   * datatokens transfered
   */
  datatoken: TransactionHistory_poolTransactions_datatoken | null
  /**
   * number of datatokens transfered, for type SWAP if value is negative it means it was removed
   */
  datatokenValue: any | null
  type: PoolTransactionType
  /**
   * pool creation transaction id
   */
  tx: string
  /**
   * block time when pool was created
   */
  timestamp: number
  /**
   * pool related to this tx
   */
  pool: TransactionHistory_poolTransactions_pool
}

export interface TransactionHistory {
  poolTransactions: TransactionHistory_poolTransactions[]
}

export interface TransactionHistoryVariables {
  user?: string | null
}
