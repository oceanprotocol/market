/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReceiptData
// ====================================================

export interface ReceiptData_datatokens_updates {
  __typename: 'MetadataUpdate'
  id: string
  tx: any
  timestamp: number
}

export interface ReceiptData_datatokens {
  __typename: 'Datatoken'
  updates: ReceiptData_datatokens_updates[] | null
}

export interface ReceiptData {
  datatokens: ReceiptData_datatokens[]
}

export interface ReceiptDataVariables {
  address: string
}
