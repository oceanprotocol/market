import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import PriceUnit from '@shared/Price/PriceUnit'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './PriceOutput.module.css'
import { AccessDetails } from 'src/@types/Price'
import { MAX_DECIMALS } from '@utils/constants'
import Decimal from 'decimal.js'

interface PriceOutputProps {
  totalPrice: string
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  symbol: string
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset: boolean
  hasDatatokenSelectedComputeAsset: boolean
  algorithmConsumeDetails: AccessDetails
  selectedComputeAssetTimeout: string
  datasetOrderPrice?: number
  algoOrderPrice?: number
  providerFeeAmount?: string
  validUntil?: string
}

function Row({
  price,
  hasPreviousOrder,
  hasDatatoken,
  symbol,
  timeout,
  sign,
  type
}: {
  price: string
  hasPreviousOrder?: boolean
  hasDatatoken?: boolean
  symbol?: string
  timeout?: string
  sign?: string
  type?: string
}) {
  return (
    <div className={styles.priceRow}>
      <div className={styles.sign}>{sign}</div>
      <div className={styles.type}>{type}</div>
      <div>
        <PriceUnit
          price={hasPreviousOrder || hasDatatoken ? '0' : `${price}`}
          symbol={symbol}
          size="small"
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
  algorithmConsumeDetails,
  selectedComputeAssetTimeout,
  datasetOrderPrice,
  algoOrderPrice,
  providerFeeAmount,
  validUntil
}: PriceOutputProps): ReactElement {
  const { asset } = useAsset()

  return (
    <div className={styles.priceComponent}>
      You will pay{' '}
      <PriceUnit price={`${totalPrice}`} symbol={symbol} size="small" />
      <Tooltip
        content={
          <div className={styles.calculation}>
            <Row
              hasPreviousOrder={hasPreviousOrder}
              hasDatatoken={hasDatatoken}
              price={new Decimal(
                datasetOrderPrice || asset?.accessDetails?.price || 0
              )
                .toDecimalPlaces(MAX_DECIMALS)
                .toString()}
              timeout={assetTimeout}
              symbol={symbol}
              type="DATASET"
            />
            <Row
              hasPreviousOrder={hasPreviousOrderSelectedComputeAsset}
              hasDatatoken={hasDatatokenSelectedComputeAsset}
              price={new Decimal(
                algoOrderPrice || algorithmConsumeDetails?.price || 0
              )
                .toDecimalPlaces(MAX_DECIMALS)
                .toString()}
              timeout={selectedComputeAssetTimeout}
              symbol={symbol}
              sign="+"
              type="ALGORITHM"
            />
            <Row
              price={providerFeeAmount} // initializeCompute.provider fee amount
              timeout={`${validUntil} seconds`} // valid until value
              symbol={symbol}
              sign="+"
              type="C2D RESOURCES"
            />
            <Row price={totalPrice} symbol={symbol} sign="=" />
          </div>
        }
      />
    </div>
  )
}
