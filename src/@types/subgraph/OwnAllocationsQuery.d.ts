/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OwnAllocationsQuery
// ====================================================

export interface OwnAllocationsQuery_veAllocations {
  __typename: 'VeAllocation'
  /**
   * id = {user}-{DataNFT Address}-{chain id}
   */
  id: string
  nftAddress: string
  allocated: any
}

export interface OwnAllocationsQuery {
  veAllocations: OwnAllocationsQuery_veAllocations[]
}

export interface OwnAllocationsQueryVariables {
  address?: string | null
}
