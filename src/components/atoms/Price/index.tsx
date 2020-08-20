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
  conversion
}: {
  ddo: DDO
  className?: string
  small?: boolean
  conversion?: boolean
}): ReactElement {
  const { ocean } = useOcean()
  const { price } = useMetadata(ddo.id)

  return !ocean ? (
    <div className={styles.empty}>Connect your wallet to view price</div>
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
