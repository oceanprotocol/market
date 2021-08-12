export interface BestPrice {
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
