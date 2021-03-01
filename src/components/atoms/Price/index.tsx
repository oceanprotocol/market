import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { useMetadata } from '@oceanprotocol/react'
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
  // price is not fetched from the chain anymore , will update one AssetProvider is implemented
  const { price } = useMetadata(ddo)

  return price?.value ? (
    <PriceUnit
      price={`${price.value}`}
      className={className}
      small={small}
      conversion={conversion}
      type={price.type}
    />
  ) : !price || !price.address ? (
    <div className={styles.empty}>
      No price set{' '}
      <Tooltip content="We could not find a pool for this data set, which can have multiple reasons. Is your wallet connected to the correct network?" />
    </div>
  ) : price.isConsumable !== 'true' ? (
    <div className={styles.empty}>
      Not enough liquidity{' '}
      <Tooltip content="This pool does not have enough liquidity for using thisa data set." />
    </div>
  ) : (
    <Loader message="Retrieving price..." />
  )
}
