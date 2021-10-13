import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Loader from '../Loader'
import Tooltip from '../Tooltip'
import PriceUnit from './PriceUnit'

export default function Price({
  price,
  className,
  small,
  conversion
}: {
  price: BestPrice
  className?: string
  small?: boolean
  conversion?: boolean
}): ReactElement {
  return price?.value || price?.type === 'free' ? (
    <PriceUnit
      price={`${price.value}`}
      symbol={price.oceanSymbol}
      className={className}
      small={small}
      conversion={conversion}
      type={price.type}
    />
  ) : !price || price?.type === '' ? (
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
