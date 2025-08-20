/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NftOwnAllocationQuery
// ====================================================

export interface NftOwnAllocationQuery_veAllocations {
  __typename: 'VeAllocation'
  allocated: any
}

export interface NftOwnAllocationQuery {
  veAllocations: NftOwnAllocationQuery_veAllocations[]
}

export interface NftOwnAllocationQueryVariables {
  address?: string | null
  nftAddress?: string | null
}
