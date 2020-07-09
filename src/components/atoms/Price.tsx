import React, { ReactElement } from 'react'
import Web3 from 'web3'
import classNames from 'classnames/bind'
import styles from './Price.module.css'

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
      <span>OCEAN</span> {Web3.utils.fromWei(price)}
    </>
  )

  return <div className={styleClasses}>{displayPrice}</div>
}
