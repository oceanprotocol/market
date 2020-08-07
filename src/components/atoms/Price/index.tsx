import React, { ReactElement, useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import PriceConversion from './Conversion'
import styles from './index.module.css'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import Loader from '../Loader'
import Tooltip from '../Tooltip'

const cx = classNames.bind(styles)

export default function Price({
  ddo,
  className,
  small
}: {
  ddo: DDO
  className?: string
  small?: boolean
}): ReactElement {
  const { getBestPrice } = useMetadata(ddo.id)
  const [price, setPrice] = useState<string>()

  useEffect(() => {
    async function init() {
      const price = await getBestPrice(ddo.dataToken)
      setPrice(price)
    }
    init()
  }, [])

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

  return price ? (
    <div className={styleClasses}>{displayPrice}</div>
  ) : price === '' ? (
    <div className={styles.empty}>
      No price found{' '}
      <Tooltip content="We could not find a pool for this data set, which can have multiple reasons. Is your wallet connected to the correct network?" />
    </div>
  ) : (
    <Loader message="Retrieving price..." />
  )
}
