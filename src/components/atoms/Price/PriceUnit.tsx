import React, { ReactElement } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import classNames from 'classnames/bind'
import Conversion from './Conversion'
import styles from './PriceUnit.module.css'

const cx = classNames.bind(styles)

export default function PriceUnit({
  price,
  className,
  small,
  conversion,
  symbol
}: {
  price: string
  className?: string
  small?: boolean
  conversion?: boolean
  symbol?: string
}): ReactElement {
  const styleClasses = cx({
    price: true,
    small: small,
    [className]: className
  })

  return (
    <div className={styleClasses}>
      {Number.isNaN(Number(price))
        ? '-'
        : formatCurrency(Number(price), '', 'en', false, {
            // Not exactly clear what `significant figures` are for this library,
            // but setting this seems to give us the formatting we want.
            // See https://github.com/oceanprotocol/market/issues/70
            significantFigures: 4
          })}{' '}
      <span>{symbol || 'OCEAN'}</span>
      {conversion && <Conversion price={price} />}
    </div>
  )
}
