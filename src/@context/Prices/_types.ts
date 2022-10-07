export interface Prices {
  [key: string]: {
    [key: string]: number
  }
}

export interface PricesValue {
  prices: Prices
}
