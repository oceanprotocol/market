export interface FormTradeData extends PoolBalance {
  // in reference to datatoken, buy = swap from ocean to dt ( buy dt) , sell = swap from dt to ocean (sell dt)
  type: 'buy' | 'sell'
  slippage: string
}

export interface TradeItem {
  amount: string
  token: string
  maxAmount: string
}
