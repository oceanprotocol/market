import React, { ReactElement, useState, useEffect } from 'react'
import styles from './index.module.css'
import { useMetadata, useOcean } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import Loader from '../Loader'
import Tooltip from '../Tooltip'
import PriceUnit from './PriceUnit'

export default function Price({
  ddo,
  className,
  small,
  conversion,
  setPriceOutside
}: {
  ddo: DDO
  className?: string
  small?: boolean
  conversion?: boolean
  setPriceOutside?: (price: string) => void
}): ReactElement {
  const { ocean, chainId, accountId } = useOcean()
  const { getBestPrice } = useMetadata()
  const [price, setPrice] = useState<string>()

  useEffect(() => {
    if (!ocean || !accountId || !chainId) return

    async function init() {
      const price = await getBestPrice(ddo.dataToken)
      setPrice(price)
      setPriceOutside && price !== '' && setPriceOutside(price)
    }
    init()
  }, [chainId, accountId, ocean])

  return !ocean ? (
    <div className={styles.empty}>Please connect your wallet to view price</div>
  ) : price ? (
    <PriceUnit
      price={price}
      className={className}
      small={small}
      conversion={conversion}
    />
  ) : price === '' ? (
    <div className={styles.empty}>
      No price found{' '}
      <Tooltip content="We could not find a pool for this data set, which can have multiple reasons. Is your wallet connected to the correct network?" />
    </div>
  ) : (
    <Loader message="Retrieving price..." />
  )
}
