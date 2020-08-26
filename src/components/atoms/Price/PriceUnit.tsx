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
      {Number.isInteger(Number(price))
        ? price
        : Number.isNaN(Number(price))
        ? '-'
        : formatCurrency(Number(price), '', undefined, false, true)}{' '}
      <span>{symbol || 'OCEAN'}</span>
      {conversion && <Conversion price={price} />}
    </div>
  )
}
