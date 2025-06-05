import React, { ReactElement } from 'react'
import { AssetPrice } from '@oceanprotocol/ddo-js'
import PriceUnit from './PriceUnit'

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
  if (!price && !orderPriceAndFees) return
  return (
    <PriceUnit
      price={Number(orderPriceAndFees?.price) || Number(price?.price) || 0}
      symbol={price?.token}
      className={className}
      size={size}
      conversion={conversion}
    />
  )
}
