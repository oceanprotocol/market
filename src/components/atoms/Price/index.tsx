import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import Loader from '../Loader'
import Tooltip from '../Tooltip'
import PriceUnit from './PriceUnit'
import Badge from '../Badge'

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
  const { price } = useMetadata(ddo)

  return price?.value ? (
    <>
      <PriceUnit
        price={`${price.value}`}
        className={className}
        small={small}
        conversion={conversion}
      />
      {price?.type === 'pool' && (
        <Badge label="pool" className={styles.badge} />
      )}
    </>
  ) : !price || price?.value === 0 ? (
    <div className={styles.empty}>
      No price found{' '}
      <Tooltip content="We could not find a pool for this data set, which can have multiple reasons. Is your wallet connected to the correct network?" />
    </div>
  ) : (
    <Loader message="Retrieving price..." />
  )
}
