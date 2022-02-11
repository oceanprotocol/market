/**
 * @interface OrdePriceAndFee
 * @prop {string}  price total price including fees
 * @prop {string}  publisherMarketOrderFee fee received by the market where the asset was published. It is set on erc20 creation. It is a absolute value
 * @prop {string}  publisherMarketPoolSwapFee fee received by the market where the asset was published on any swap (pool or fre). It is a percentage
 * @prop {string}  publisherMarketFixedSwapFee fee received by the market where the asset was published on any swap (pool or fre). It is a percentage
 * @prop {string}  consumeMarketOrderFee fee received by the market where the asset was published. It is set on erc20 creation. It is a absolute value
 * @prop {string}  consumeMarketPoolSwapFee fee received by the market where the asset was published on any swap (pool or fre). It is a percentage
 * @prop {string}  consumeMarketFixedSwapFee fee received by the market where the asset was published on any swap (pool or fre). It is a percentage
 * @prop {string}  liquidityProviderSwapFee fee received by the liquidity providers of the pool. It is a percentage  ( ex 50% means liquidityProviderSwapFee=0.5)
 * @prop {string}  opcFee ocean protocol community fee, it is a percentage
 */
interface OrdePriceAndFee {
  price: string
  publisherMarketOrderFee: string
  publisherMarketPoolSwapFee: string
  publisherMarketFixedSwapFee: string
  consumeMarketOrderFee: string
  consumeMarketPoolSwapFee: string
  consumeMarketFixedSwapFee: string
  providerFee: string
  opcFee: string
}

/**
 * @interface AccessDetails
 * @prop {'dynamic' | 'fixed' | 'free' | ''}  type
 * @prop {string} price can be either spotPrice/rate or price including fees based on `isOrderPrice` when calling `getAccessDetails`
 * @prop {string} addressOrId if type is dynamic this is the pool address, for fixed/free this is an id.
 * @prop {TokenInfo} baseToken
 * @prop {TokenInfo} datatoken
 * @prop {bool} isPurchasable checks if you can buy a datatoken from fixed rate exchange/pool/dispenser. For pool it also checks if there is enough dt liquidity
 * @prop {bool} isOwned checks if there are valid orders for this, it also takes in consideration timeout
 * @prop {string} validOrderTx  the latest valid order tx, it also takes in consideration timeout
 * @prop {FeeInfo} feeInfo  values of the relevant fees
 */
interface AccessDetails {
  type: 'dynamic' | 'fixed' | 'free' | ''
  price: string
  addressOrId: string
  baseToken: TokenInfo
  datatoken: TokenInfo
  isPurchasable?: boolean
  isOwned: bool
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
