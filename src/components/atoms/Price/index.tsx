import React, { ReactElement } from 'react'
import { fromWei } from 'web3-utils'
import classNames from 'classnames/bind'
import PriceConversion from './Conversion'
import styles from './index.module.css'

const cx = classNames.bind(styles)

export default function Price({
  price,
  className,
  small
}: {
  price: string
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
      <span>OCEAN</span> {price}
      <PriceConversion price={price} />
    </>
  )

  return <div className={styleClasses}>{displayPrice}</div>
}
