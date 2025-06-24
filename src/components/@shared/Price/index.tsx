import React, { ReactElement } from 'react'
import { AssetPrice } from '@oceanprotocol/ddo-js'
import PriceUnit from './PriceUnit'
import { getOceanConfig } from '@utils/ocean'
import Loader from '@shared/atoms/Loader'

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
  if (!price || price.price === undefined || price.price === null) {
    return <Loader message="Fetching price..." />
  }

  const rawPrice = price?.price
  console.log('Raw price', rawPrice)
  const parsedPrice =
    rawPrice === null || rawPrice === undefined
      ? null
      : isNaN(Number(rawPrice))
      ? NaN
      : Number(rawPrice)
  return (
    <PriceUnit
      price={parsedPrice}
      symbol={symbol}
      className={className}
      size={size}
      conversion={conversion}
    />
  )
}
