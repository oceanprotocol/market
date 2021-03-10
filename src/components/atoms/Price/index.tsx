import React, { ReactElement } from 'react'
import styles from './index.module.css'
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
  return ddo.price?.value ? (
    <PriceUnit
      price={`${ddo.price.value}`}
      className={className}
      small={small}
      conversion={conversion}
      type={ddo.price.type}
    />
  ) : !ddo.price || !ddo.price.address || ddo.price.address === '' ? (
    <div className={styles.empty}>
      No price set{' '}
      <Tooltip content="No pricing mechanism has been set on this asset yet." />
    </div>
  ) : ddo.price.isConsumable !== 'true' ? (
    <div className={styles.empty}>
      Low liquidity{' '}
      <Tooltip content="This pool does not have enough liquidity for using this data set." />
    </div>
  ) : (
    <Loader message="Retrieving price..." />
  )
}
