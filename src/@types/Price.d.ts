interface AccessDetails {
  type: 'dynamic' | 'fixed' | 'free' | ''
  /**
   * for pool this is the spot price, this should not be used directly to buy from
   */
  price: number
  /**
   * if type is dynamic this is the pool address, for fixed/free this is an id.
   */
  addressOrId: string
  baseToken: TokenInfo
  datatoken: TokenInfo
  /**
   * checks if you can buy a datatoken from fixed rate exchange/pool/dispenser. For pool it also checks if there is enough dt liquidity
   */
  isPurchasable?: boolean
  /**
   * checks if there are valid orders for this, it also takes in consideration timeout
   */
  isOwned: bool
  /**
   * the latest valid order tx, it also takes in consideration timeout
   */
  validOrderTx: string
}

interface PriceOptions {
  price: number
  amountDataToken: number
  amountOcean: number
  type: 'dynamic' | 'fixed' | 'free' | ''
  weightOnDataToken: string
  weightOnOcean: string
  // easier to keep this as number for Yup input validation
  swapFee: number
}

interface PriceAndEstimation {
  /**
   * the actual price to buy one datatoken
   */
  price: string
  /**
   * gas estimation to buy one datatoken  !!! not working currently !!!!
   */
  gasEstimation: number
}
