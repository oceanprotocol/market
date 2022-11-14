import React, { ReactElement } from 'react'
import PriceUnit from './PriceUnit'

interface Price {
  value: number
  tokenSymbol?: string
  tokenAddress?: string
}

export default function Price({
  price,
  className,
  size,
  conversion
}: {
  price: Price
  className?: string
  conversion?: boolean
  size?: 'small' | 'mini' | 'large'
}): ReactElement {
  console.log('price.value', price.value)

  return price.value ? (
    <PriceUnit
      price={Number(price)}
      symbol={price.tokenSymbol}
      className={className}
      size={size}
      conversion={conversion}
    />
  ) : null
}
