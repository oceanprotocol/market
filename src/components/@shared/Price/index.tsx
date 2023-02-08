import React, { ReactElement } from 'react'
import { AssetPrice } from '@oceanprotocol/lib'
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
      price={Number(orderPriceAndFees?.price) || price?.value}
      symbol={price?.tokenSymbol}
      className={className}
      size={size}
      conversion={conversion}
    />
  )
}
