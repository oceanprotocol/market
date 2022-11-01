/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TokensPriceQuery
// ====================================================

export interface TokensPriceQuery_tokens_orders_reuses {
  __typename: "OrderReuse";
  id: string;
  caller: string;
  createdTimestamp: number;
  tx: string;
  block: number;
}

export interface TokensPriceQuery_tokens_orders {
  __typename: "Order";
  tx: string;
  serviceIndex: number;
  createdTimestamp: number;
  reuses: TokensPriceQuery_tokens_orders_reuses[] | null;
}

export interface TokensPriceQuery_tokens_dispensers_token {
  __typename: "Token";
  id: string;
  name: string | null;
  symbol: string | null;
}

export interface TokensPriceQuery_tokens_dispensers {
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
  token: TokensPriceQuery_tokens_dispensers_token;
}

export interface TokensPriceQuery_tokens_fixedRateExchanges_baseToken {
  __typename: "Token";
  symbol: string | null;
  name: string | null;
  address: string;
  decimals: number;
}

export interface TokensPriceQuery_tokens_fixedRateExchanges_datatoken {
  __typename: "Token";
  symbol: string | null;
  name: string | null;
  address: string;
}

export interface TokensPriceQuery_tokens_fixedRateExchanges {
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
  baseToken: TokensPriceQuery_tokens_fixedRateExchanges_baseToken;
  datatoken: TokensPriceQuery_tokens_fixedRateExchanges_datatoken;
  active: boolean;
}

export interface TokensPriceQuery_tokens {
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
  orders: TokensPriceQuery_tokens_orders[] | null;
  /**
   * dispensers using this token
   */
  dispensers: TokensPriceQuery_tokens_dispensers[] | null;
  /**
   * fixed rate exchanges, only available for datatokens
   */
  fixedRateExchanges: TokensPriceQuery_tokens_fixedRateExchanges[] | null;
}

export interface TokensPriceQuery {
  tokens: TokensPriceQuery_tokens[];
}

export interface TokensPriceQueryVariables {
  datatokenIds?: string[] | null;
  account?: string | null;
}
