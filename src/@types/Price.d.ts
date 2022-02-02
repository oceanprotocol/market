interface AccessDetails {
  type: 'dynamic' | 'fixed' | 'free' | ''
  price: number
  // if type is dynamic this is the pool address, for fixed/free this is an id.
  addressOrId: string
  baseToken: TokenInfo
  datatoken: TokenInfo
  isConsumable?: boolean
  // if there are valid orders for this
  owned: bool
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
