export interface FormTradeData extends PoolBalance {
  // in reference to datatoken, buy = swap from ocean to dt ( buy dt) , sell = swap from dt to ocean (sell dt)
  type: 'buy' | 'sell'
  // based on what the user inputs, if he fill the top input it is 'exactIn'
  output: 'exactIn' | 'exactOut'
  slippage: string
}

export interface TradeItem {
  amount: string
  token: string
  maxAmount: string
  address: string
}
