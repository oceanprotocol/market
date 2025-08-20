/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NftOwnAllocation
// ====================================================

export interface NftOwnAllocation_veAllocations {
  __typename: 'VeAllocation'
  allocated: any
}

export interface NftOwnAllocation {
  veAllocations: NftOwnAllocation_veAllocations[]
}

export interface NftOwnAllocationVariables {
  address?: string | null
  nftAddress?: string | null
}
