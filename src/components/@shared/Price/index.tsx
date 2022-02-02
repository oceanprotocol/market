import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Loader from '../atoms/Loader'
import Tooltip from '../atoms/Tooltip'
import PriceUnit from './PriceUnit'

export default function Price({
  consumeDetails,
  className,
  small,
  conversion
}: {
  consumeDetails: ConsumeDetails
  className?: string
  small?: boolean
  conversion?: boolean
}): ReactElement {
  return consumeDetails?.price || consumeDetails?.type === 'free' ? (
    <PriceUnit
      price={`${consumeDetails.price}`}
      symbol={consumeDetails.baseToken?.symbol}
      className={className}
      small={small}
      conversion={conversion}
      type={consumeDetails.type}
    />
  ) : !consumeDetails || consumeDetails?.type === '' ? (
    <div className={styles.empty}>
      No price set{' '}
      <Tooltip content="No pricing mechanism has been set on this asset yet." />
    </div>
  ) : (
    // TODO: Hacky hack, put back some check for low liquidity
    // ) : price.isConsumable !== 'true' ? (
    //   <div className={styles.empty}>
    //     Low liquidity{' '}
    //     <Tooltip content="This pool does not have enough liquidity for using this data set." />
    //   </div>
    <Loader message="Retrieving price..." />
  )
}
