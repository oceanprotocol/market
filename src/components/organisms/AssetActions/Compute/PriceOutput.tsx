import { BestPrice } from '@oceanprotocol/lib'
import React, { ReactElement } from 'react'
import { useAsset } from '../../../../providers/Asset'
import PriceUnit from '../../../atoms/Price/PriceUnit'
import Tooltip from '../../../atoms/Tooltip'
import * as styles from './PriceOutput.module.css'

interface PriceOutputProps {
  totalPrice: number
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset: boolean
  hasDatatokenSelectedComputeAsset: boolean
  algorithmPrice: BestPrice
  selectedComputeAssetTimeout: string
}

function Row({
  price,
  hasPreviousOrder,
  hasDatatoken,
  timeout,
  sign
}: {
  price: number
  hasPreviousOrder?: boolean
  hasDatatoken?: boolean
  timeout?: string
  sign?: string
}) {
  return (
    <div className={styles.priceRow}>
      <div className={styles.sign}>{sign}</div>
      <div>
        <PriceUnit
          price={hasPreviousOrder || hasDatatoken ? '0' : `${price}`}
          small
          className={styles.price}
        />
        <span className={styles.timeout}>
          {timeout &&
            timeout !== 'Forever' &&
            !hasPreviousOrder &&
            `for ${timeout}`}
        </span>
      </div>
    </div>
  )
}

export default function PriceOutput({
  totalPrice,
  hasPreviousOrder,
  hasDatatoken,
  assetTimeout,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  algorithmPrice,
  selectedComputeAssetTimeout
}: PriceOutputProps): ReactElement {
  const { price } = useAsset()

  return (
    <div className={styles.priceComponent}>
      You will pay <PriceUnit price={`${totalPrice}`} small />
      <Tooltip
        content={
          <div className={styles.calculation}>
            <Row
              hasPreviousOrder={hasPreviousOrder}
              hasDatatoken={hasDatatoken}
              price={price?.value}
              timeout={assetTimeout}
            />
            <Row
              hasPreviousOrder={hasPreviousOrderSelectedComputeAsset}
              hasDatatoken={hasDatatokenSelectedComputeAsset}
              price={algorithmPrice?.value}
              timeout={selectedComputeAssetTimeout}
              sign="+"
            />
            <Row price={totalPrice} sign="=" />
          </div>
        }
      />
    </div>
  )
}
