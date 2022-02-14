import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Loader from '../atoms/Loader'
import Tooltip from '../atoms/Tooltip'
import PriceUnit from './PriceUnit'
import { AccessDetails } from 'src/@types/Price'

export default function Price({
  accessDetails,
  className,
  small,
  conversion
}: {
  accessDetails: AccessDetails
  className?: string
  small?: boolean
  conversion?: boolean
}): ReactElement {
  return accessDetails?.price || accessDetails?.type === 'free' ? (
    <PriceUnit
      price={`${accessDetails.price}`}
      symbol={accessDetails.baseToken?.symbol}
      className={className}
      small={small}
      conversion={conversion}
      type={accessDetails.type}
    />
  ) : !accessDetails || accessDetails?.type === '' ? (
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
