/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FooterStatsValues
// ====================================================

export interface FooterStatsValues_globalStatistics {
  __typename: "GlobalStatistic";
  /**
   * total nfts(erc721) created
   */
  nftCount: number;
  /**
   * total datatokens (tokens with isDatatoken = true) created
   */
  datatokenCount: number;
  /**
   * number of total orders. fixed rate exchange orders + dispenser orders
   */
  orderCount: number;
}

export interface FooterStatsValues {
  globalStatistics: FooterStatsValues_globalStatistics[];
}
