/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NftUpdateType } from "./globalTypes";

// ====================================================
// GraphQL query operation: NftUpdate
// ====================================================

export interface NftUpdate_nftUpdates_nft {
  __typename: "Nft";
  /**
   * same as id, it's just for easy discoverability
   */
  address: string;
  /**
   * address of the owner of the nft
   */
  owner: string;
}

export interface NftUpdate_nftUpdates {
  __typename: "NftUpdate";
  id: string;
  nft: NftUpdate_nftUpdates_nft;
  tx: string;
  timestamp: number;
  /**
   * type of the update: metadata created, metadata update, state update, token uri update
   */
  type: NftUpdateType;
}

export interface NftUpdate {
  nftUpdates: NftUpdate_nftUpdates[];
}

export interface NftUpdateVariables {
  address: string;
}
