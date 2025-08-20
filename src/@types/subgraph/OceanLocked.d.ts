/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OceanLocked
// ====================================================

export interface OceanLocked_veOCEAN {
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

export interface OceanLocked {
  veOCEAN: OceanLocked_veOCEAN | null
}

export interface OceanLockedVariables {
  address?: string | null
}
