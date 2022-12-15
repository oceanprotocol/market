import React, { ReactElement } from 'react'
import { AssetPrice } from '@oceanprotocol/lib'
import PriceUnit from './PriceUnit'

export default function Price({
  price,
  className,
  size,
  conversion
}: {
  price: AssetPrice
  assetId?: string
  className?: string
  conversion?: boolean
  size?: 'small' | 'mini' | 'large'
}): ReactElement {
  return price?.value !== undefined ? (
    <PriceUnit
      price={price.value}
      symbol={price.tokenSymbol}
      className={className}
      size={size}
      conversion={conversion}
    />
  ) : null
}
