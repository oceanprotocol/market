import React, { ReactElement } from 'react'
import { useAsset } from '../../../../context/Asset'
import PriceUnit from '@shared/atoms/Price/PriceUnit'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './PriceOutput.module.css'

interface PriceOutputProps {
  totalPrice: number
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  symbol: string
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
  symbol,
  timeout,
  sign
}: {
  price: number
  hasPreviousOrder?: boolean
  hasDatatoken?: boolean
  symbol?: string
  timeout?: string
  sign?: string
}) {
  return (
    <div className={styles.priceRow}>
      <div className={styles.sign}>{sign}</div>
      <div>
        <PriceUnit
          price={hasPreviousOrder || hasDatatoken ? '0' : `${price}`}
          symbol={symbol}
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
  symbol,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  algorithmPrice,
  selectedComputeAssetTimeout
}: PriceOutputProps): ReactElement {
  const { price } = useAsset()

  return (
    <div className={styles.priceComponent}>
      You will pay <PriceUnit price={`${totalPrice}`} symbol={symbol} small />
      <Tooltip
        content={
          <div className={styles.calculation}>
            <Row
              hasPreviousOrder={hasPreviousOrder}
              hasDatatoken={hasDatatoken}
              price={price?.value}
              timeout={assetTimeout}
              symbol={symbol}
            />
            <Row
              hasPreviousOrder={hasPreviousOrderSelectedComputeAsset}
              hasDatatoken={hasDatatokenSelectedComputeAsset}
              price={algorithmPrice?.value}
              timeout={selectedComputeAssetTimeout}
              symbol={symbol}
              sign="+"
            />
            <Row price={totalPrice} symbol={symbol} sign="=" />
          </div>
        }
      />
    </div>
  )
}
