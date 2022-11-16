import React, { ReactElement } from 'react'
import { AssetPrice } from '@oceanprotocol/lib'
import PriceUnit from './PriceUnit'

export default function Price({
  price,
  assetId,
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
  console.log('price.value', price, assetId)
  console.log('price.value', Number(price.value))

  return price?.value ? (
    <PriceUnit
      price={Number(price.value)}
      symbol={price.tokenSymbol}
      className={className}
      size={size}
      conversion={conversion}
    />
  ) : null
}
