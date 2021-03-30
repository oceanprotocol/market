import { PoolBalance } from '../@types/TokenBalance'

export interface FormTradeData extends PoolBalance {
  // in reference to datatoken, buy = swap from ocean to dt ( buy dt) , sell = swap from dt to ocean (sell dt)
  type: 'buy' | 'sell'
  slippage: string
}

export interface TradeItem {
  amount: number
  token: string
  maxAmount: number
}

export const initialValues: FormTradeData = {
  ocean: undefined,
  datatoken: undefined,
  type: 'buy',
  slippage: '5'
}

export const slippagePresets = ['5', '10', '15', '25', '50']

// validationSchema lives in components/organisms/AssetActions/Trade/FormTrade.tsx
