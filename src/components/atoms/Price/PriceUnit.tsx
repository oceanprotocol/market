import React, { ReactElement } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import Conversion from './Conversion'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Badge from '../Badge'
import {
  price as priceStyle,
  symbol as symbolStyle,
  badge,
  small as smallStyle
} from './PriceUnit.module.css'

export function formatPrice(price: string, locale: string): string {
  return formatCurrency(Number(price), '', locale, false, {
    // Not exactly clear what `significant figures` are for this library,
    // but setting this seems to give us the formatting we want.
    // See https://github.com/oceanprotocol/market/issues/70
    significantFigures: 4
  })
}

export default function PriceUnit({
  price,
  className,
  small,
  conversion,
  symbol,
  type
}: {
  price: string
  type?: string
  className?: string
  small?: boolean
  conversion?: boolean
  symbol?: string
}): ReactElement {
  const { locale } = useUserPreferences()

  return (
    <div className={`${priceStyle} ${small && smallStyle} ${className}`}>
      <div>
        {Number.isNaN(Number(price)) ? '-' : formatPrice(price, locale)}{' '}
        <span className={symbolStyle}>{symbol || 'OCEAN'}</span>
        {type && type === 'pool' && <Badge label="pool" className={badge} />}
      </div>

      {conversion && <Conversion price={price} />}
    </div>
  )
}
