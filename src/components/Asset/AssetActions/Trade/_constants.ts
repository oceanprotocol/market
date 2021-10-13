import { FormTradeData } from './_types'

export const initialValues: FormTradeData = {
  ocean: undefined,
  datatoken: undefined,
  type: 'buy',
  slippage: '5'
}

export const slippagePresets = ['5', '10', '15', '25', '50']

// validationSchema lives in components/organisms/AssetActions/Trade/FormTrade.tsx
