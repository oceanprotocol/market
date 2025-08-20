/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PoolTransactionType } from './globalTypes'

// ====================================================
// GraphQL query operation: TransactionHistoryByPool
// ====================================================

export interface TransactionHistoryByPool_poolTransactions_baseToken {
  __typename: 'Token'
  symbol: string | null
  address: string
}

export interface TransactionHistoryByPool_poolTransactions_datatoken {
  __typename: 'Token'
  symbol: string | null
  address: string
}

export interface TransactionHistoryByPool_poolTransactions_pool_datatoken {
  __typename: 'Token'
  id: string
}

export interface TransactionHistoryByPool_poolTransactions_pool {
  __typename: 'Pool'
  datatoken: TransactionHistoryByPool_poolTransactions_pool_datatoken
  /**
   * pool address
   */
  id: string
}

export interface TransactionHistoryByPool_poolTransactions {
  __typename: 'PoolTransaction'
  /**
   * base tokens transfered
   */
  baseToken: TransactionHistoryByPool_poolTransactions_baseToken | null
  /**
   * number of base tokens transfered, for type SWAP if value is negative it means it was removed
   */
  baseTokenValue: any | null
  /**
   * datatokens transfered
   */
  datatoken: TransactionHistoryByPool_poolTransactions_datatoken | null
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
  pool: TransactionHistoryByPool_poolTransactions_pool
}

export interface TransactionHistoryByPool {
  poolTransactions: TransactionHistoryByPool_poolTransactions[]
}

export interface TransactionHistoryByPoolVariables {
  user?: string | null
  pool?: string | null
}
