import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import PriceConversion from './Conversion'
import styles from './index.module.css'
import { formatCurrency } from '@coingecko/cryptoformat'

const cx = classNames.bind(styles)

export default function Price({
  price,
  className,
  small
}: {
  price: string // expects price in OCEAN, not wei
  className?: string
  small?: boolean
}): ReactElement {
  const styleClasses = cx({
    price: true,
    small: small,
    [className]: className
  })

  const isFree = price === '0'

  const displayPrice = isFree ? (
    'Free'
  ) : (
    <>
      <span>OCEAN</span> {formatCurrency(Number(price), '', 'en', false, true)}
      <PriceConversion price={price} />
    </>
  )

  return <div className={styleClasses}>{displayPrice}</div>
}
