/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OceanLockedQuery
// ====================================================

export interface OceanLockedQuery_veOCEAN {
  __typename: 'VeOCEAN'
  /**
   * id = {user address}
   */
  id: string
  /**
   * total amount of locked tokens
   */
  lockedAmount: any
  /**
   * unlock timestamp
   */
  unlockTime: any
}

export interface OceanLockedQuery {
  veOCEAN: OceanLockedQuery_veOCEAN | null
}

export interface OceanLockedQueryVariables {
  address: string
}
