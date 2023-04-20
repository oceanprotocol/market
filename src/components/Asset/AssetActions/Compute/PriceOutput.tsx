import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import PriceUnit from '@shared/Price/PriceUnit'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './PriceOutput.module.css'
import { MAX_DECIMALS } from '@utils/constants'
import Decimal from 'decimal.js'
import { useWeb3 } from '@context/Web3'

interface PriceOutputProps {
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  symbol: string
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset: boolean
  hasDatatokenSelectedComputeAsset: boolean
  algorithmConsumeDetails: AccessDetails
  algorithmSymbol: string
  selectedComputeAssetTimeout: string
  datasetOrderPrice?: string
  algoOrderPrice?: string
  providerFeeAmount?: string
  providerFeesSymbol?: string
  validUntil?: string
  totalPrices?: totalPriceMap[]
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
          price={hasPreviousOrder || hasDatatoken ? 0 : Number(price)}
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
  hasPreviousOrder,
  hasDatatoken,
  assetTimeout,
  symbol,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  algorithmConsumeDetails,
  algorithmSymbol,
  selectedComputeAssetTimeout,
  datasetOrderPrice,
  algoOrderPrice,
  providerFeeAmount,
  providerFeesSymbol,
  validUntil,
  totalPrices
}: PriceOutputProps): ReactElement {
  const { asset } = useAsset()

  return (
    <div className={styles.priceComponent}>
      You will pay{' '}
      {totalPrices.map((item, index) => (
        <div key={item.symbol}>
          <PriceUnit
            price={Number(item.value)}
            symbol={
              index < totalPrices.length - 1 ? `${item.symbol} & ` : item.symbol
            }
            size="small"
          />
        </div>
      ))}
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
              symbol={algorithmSymbol}
              sign="+"
              type="ALGORITHM"
            />
            <Row
              price={providerFeeAmount} // initializeCompute.provider fee amount
              timeout={`${validUntil} seconds`} // valid until value
              symbol={providerFeesSymbol} // we assume that provider fees will always be in OCEAN token
              sign="+"
              type="C2D RESOURCES"
            />
            {totalPrices.map((item, index) => (
              <Row
                price={item.value}
                symbol={item.symbol}
                sign={index === 0 ? '=' : '&'}
                key={item.symbol}
              />
            ))}
          </div>
        }
      />
    </div>
  )
}
