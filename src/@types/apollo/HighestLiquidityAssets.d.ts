/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HighestLiquidityAssets
// ====================================================

export interface HighestLiquidityAssets_pools {
  __typename: 'Pool'
  id: string
  datatokenAddress: string
  valueLocked: any
  oceanReserve: any
}

export interface HighestLiquidityAssets {
  pools: HighestLiquidityAssets_pools[]
}
