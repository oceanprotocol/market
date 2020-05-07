import React from 'react'
import Web3 from 'web3'
import styles from './Price.module.css'

export default function Price({
  price,
  className
}: {
  price: string
  className?: string
}) {
  const classes = className ? `${styles.price} ${className}` : styles.price
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
