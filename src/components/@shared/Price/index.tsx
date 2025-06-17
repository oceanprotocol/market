import React, { ReactElement } from 'react'
import { AssetPrice } from '@oceanprotocol/ddo-js'
import PriceUnit from './PriceUnit'
import { getOceanConfig } from '@utils/ocean'

export default function Price({
  price,
  orderPriceAndFees,
  className,
  size,
  conversion
}: {
  price: AssetPrice
  orderPriceAndFees?: OrderPriceAndFees
  assetId?: string
  className?: string
  conversion?: boolean
  size?: 'small' | 'mini' | 'large'
}): ReactElement {
  const oceanConfig = getOceanConfig(11155111)
  const symbol = oceanConfig.oceanTokenSymbol

  if (!price && !orderPriceAndFees) return
  return (
    <PriceUnit
      price={Number(price?.price) || Number(price?.price) || 0}
      symbol={symbol}
      className={className}
      size={size}
      conversion={conversion}
    />
  )
}
