import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Loader from '../atoms/Loader'
import Tooltip from '../atoms/Tooltip'
import PriceUnit from './PriceUnit'
import { AccessDetails, OrderPriceAndFees } from 'src/@types/Price'

export default function Price({
  accessDetails,
  orderPriceAndFees,
  className,
  size,
  conversion
}: {
  accessDetails: AccessDetails
  orderPriceAndFees?: OrderPriceAndFees
  className?: string
  conversion?: boolean
  size?: 'small' | 'mini' | 'large'
}): ReactElement {
  return accessDetails?.price || accessDetails?.type === 'free' ? (
    <PriceUnit
      price={`${orderPriceAndFees?.price || accessDetails?.price}`}
      symbol={accessDetails.baseToken?.symbol}
      className={className}
      size={size}
      conversion={conversion}
      type={accessDetails.type}
    />
  ) : (
    <Loader message="Retrieving price..." />
  )
}
