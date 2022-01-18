/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PoolsData
// ====================================================

export interface PoolsData_poolFactories {
  __typename: 'PoolFactory'
  totalValueLocked: any | null
  totalOceanLiquidity: any
  finalizedPoolCount: number
}

export interface PoolsData {
  poolFactories: PoolsData_poolFactories[]
}
