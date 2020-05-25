import React from 'react'
import Web3 from 'web3'
import styles from './Price.module.css'

export default function Price({
  price,
  className,
  small
}: {
  price: string
  className?: string
  small?: boolean
}) {
  const classes = small
    ? `${styles.price} ${styles.small} ${className}`
    : `${styles.price} ${className}`
  const isFree = price === '0'
  const displayPrice = isFree ? (
    'Free'
  ) : (
    <>
      <span>OCEAN</span> {Web3.utils.fromWei(price)}
    </>
  )

  return <div className={classes}>{displayPrice}</div>
}
