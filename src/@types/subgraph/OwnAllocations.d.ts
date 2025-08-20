/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OwnAllocations
// ====================================================

export interface OwnAllocations_veAllocations {
  __typename: 'VeAllocation'
  /**
   * id = {user}-{DataNFT Address}-{chain id}
   */
  id: string
  nftAddress: string
  allocated: any
}

export interface OwnAllocations {
  veAllocations: OwnAllocations_veAllocations[]
}

export interface OwnAllocationsVariables {
  address?: string | null
}
