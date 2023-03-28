import { ProviderFees } from '@oceanprotocol/lib'

// declaring into global scope to be able to use this as
// ambiant types despite the above imports
declare global {
  /**
   * @interface OrderPriceAndFee
   * @prop {string}  price total price including fees
   * @prop {string}  publisherMarketOrderFee fee received by the market where the asset was published. It is set on erc20 creation. It is a absolute value
   * @prop {string}  publisherMarketFixedSwapFee fee received by the market where the asset was published on any swap (fre). Absolute value based on the configured percentage
   * @prop {string}  consumeMarketOrderFee fee received by the market where the asset is ordered. It is set on erc20 creation. It is a absolute value
   * @prop {string}  consumeMarketFixedSwapFee fee received by the market where the asset is ordered on any swap (fre). Absolute value based on the configured percentage
   * @prop {ProviderFees} providerFee received from provider
   * @prop {string}  opcFee ocean protocol community fee, Absolute value based on the configured percentage
   */
  interface OrderPriceAndFees {
    price: string
    publisherMarketOrderFee: string
    publisherMarketFixedSwapFee: string
    consumeMarketOrderFee: string
    consumeMarketFixedSwapFee: string
    providerFee: ProviderFees
    opcFee: string
  }

  /**
   * @interface AccessDetails
   * @prop {'fixed' | 'free' | 'NOT_SUPPORTED'}  type
   * @prop {string} price can be either spotPrice/rate
   * @prop {string} addressOrId for fixed/free this is an id.
   * @prop {TokenInfo} baseToken
   * @prop {TokenInfo} datatoken
   * @prop {bool} isPurchasable checks if you can buy a datatoken from fixed rate exchange/dispenser.
   * @prop {bool} isOwned checks if there are valid orders for this, it also takes in consideration timeout
   * @prop {string} validOrderTx  the latest valid order tx, it also takes in consideration timeout
   * @prop {string} publisherMarketOrderFee this is here just because it's more efficient, it's allready in the query
   * @prop {ProviderFees} validProviderFees  the latest valid order providerfees if there where any, checks them against current timestamp
   */
  interface AccessDetails {
    type: 'fixed' | 'free' | 'NOT_SUPPORTED'
    price: string
    templateId: number
    addressOrId: string
    baseToken: TokenInfo
    datatoken: TokenInfo
    isPurchasable?: boolean
    isOwned: bool
    validOrderTx: string
    publisherMarketOrderFee: string
    validProviderFees?: ProviderFees
  }

  interface PricePublishOptions {
    price: number
    baseToken: TokenInfo
    type: 'fixed' | 'free'
    freeAgreement: boolean
  }
}
