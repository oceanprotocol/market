/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TokenPriceQuery
// ====================================================

export interface TokenPriceQuery_token_orders_reuses {
  __typename: "OrderReuse";
  id: string;
  caller: string;
  createdTimestamp: number;
  tx: string;
  block: number;
}

export interface TokenPriceQuery_token_orders {
  __typename: "Order";
  tx: string;
  serviceIndex: number;
  createdTimestamp: number;
  reuses: TokenPriceQuery_token_orders_reuses[] | null;
}

export interface TokenPriceQuery_token_dispensers_token {
  __typename: "Token";
  id: string;
  name: string | null;
  symbol: string | null;
}

export interface TokenPriceQuery_token_dispensers {
  __typename: "Dispenser";
  /**
   * token address
   */
  id: string;
  active: boolean;
  isMinter: boolean | null;
  /**
   * max balance of requester. If the balance is higher, the dispense is rejected
   */
  maxBalance: any;
  token: TokenPriceQuery_token_dispensers_token;
}

export interface TokenPriceQuery_token_fixedRateExchanges_baseToken {
  __typename: "Token";
  symbol: string | null;
  name: string | null;
  address: string;
  decimals: number;
}

export interface TokenPriceQuery_token_fixedRateExchanges_datatoken {
  __typename: "Token";
  symbol: string | null;
  name: string | null;
  address: string;
}

export interface TokenPriceQuery_token_fixedRateExchanges {
  __typename: "FixedRateExchange";
  /**
   * fixed rate exchange id
   */
  id: string;
  exchangeId: string;
  price: any;
  /**
   * fee amount. Fixed value
   */
  publishMarketSwapFee: any | null;
  baseToken: TokenPriceQuery_token_fixedRateExchanges_baseToken;
  datatoken: TokenPriceQuery_token_fixedRateExchanges_datatoken;
  active: boolean;
}

export interface TokenPriceQuery_token {
  __typename: "Token";
  id: string;
  symbol: string | null;
  name: string | null;
  /**
   * address of the market where the datatoken was created. This address collects market fees.
   */
  publishMarketFeeAddress: string | null;
  /**
   * adreess of fee token (can be Ocean, ETH, etc.)
   */
  publishMarketFeeToken: string | null;
  /**
   * fee amount. Fixed value.
   */
  publishMarketFeeAmount: any | null;
  /**
   * orders created with the datatoken, only available for datatokens
   */
  orders: TokenPriceQuery_token_orders[] | null;
  /**
   * dispensers using this token
   */
  dispensers: TokenPriceQuery_token_dispensers[] | null;
  /**
   * fixed rate exchanges, only available for datatokens
   */
  fixedRateExchanges: TokenPriceQuery_token_fixedRateExchanges[] | null;
}

export interface TokenPriceQuery {
  token: TokenPriceQuery_token | null;
}

export interface TokenPriceQueryVariables {
  datatokenId: string;
  account?: string | null;
}
