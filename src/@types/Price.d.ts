interface BestPrice {
  type: 'pool' | 'exchange' | 'free' | ''
  address: string
  value: number
  isConsumable?: 'true' | 'false' | ''
  ocean?: number
  oceanSymbol?: string
  datatoken?: number
  datatokenSymbol?: string
  exchangeId?: string
  pools: string[]
}

interface PriceOptions {
  price: number
  amountDataToken: number
  amountOcean: number
  type: 'fixed' | 'dynamic' | 'free' | string
  weightOnDataToken: string
  weightOnOcean: string
  // easier to keep this as number for Yup input validation
  swapFee: number
}
