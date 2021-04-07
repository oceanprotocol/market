import React, { FormEvent, ReactElement } from 'react'
import Button from './Button'
import styles from './ButtonBuy.module.css'
import Loader from './Loader'

interface ButtonBuyProps {
  action: 'download' | 'compute'
  disabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  dtSymbol: string
  dtBalance: string
  assetType: string
  assetTimeout: string
  hasPreviousOrderSelectedComputeAsset?: boolean
  hasDatatokenSelectedComputeAsset?: boolean
  dtSymbolSelectedComputeAsset?: string
  dtBalanceSelectedComputeAsset?: string
  selectedComputeAssetType?: string
  selectedComputeAssetTimeout?: string
  isLoading: boolean
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
  stepText?: string
  type?: 'submit'
}

function getConsumeHelpText(
  dtBalance: string,
  dtSymbol: string,
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  timeout: string,
  assetType: string
) {
  const assetTimeout = timeout === 'Forever' ? '' : ` for ${timeout}`
  const text = hasPreviousOrder
    ? `You bought this ${assetType} already allowing you to use it without paying again${assetTimeout}.`
    : hasDatatoken
    ? `You own ${dtBalance} ${dtSymbol} allowing you to use this data set by spending 1 ${dtSymbol}, but without paying OCEAN again.`
    : `For using this ${assetType}, you will buy 1 ${dtSymbol} and immediately spend it back to the publisher and pool.`

  return text
}

function getComputeAssetHelpText(
  hasPreviousOrder: boolean,
  hasDatatoken: boolean,
  dtSymbol: string,
  dtBalance: string,
  assetType: string,
  assetTimeout: string,
  hasPreviousOrderSelectedComputeAsset?: boolean,
  hasDatatokenSelectedComputeAsset?: boolean,
  dtSymbolSelectedComputeAsset?: string,
  dtBalanceSelectedComputeAsset?: string,
  selectedComputeAssetType?: string,
  selectedComputeAssetTimeout?: string
) {
  const computeAssetHelpText = getConsumeHelpText(
    dtBalance,
    dtSymbol,
    hasDatatoken,
    hasPreviousOrder,
    assetTimeout,
    assetType
  )
  const timeout =
    selectedComputeAssetTimeout === 'Forever'
      ? ''
      : ` for ${selectedComputeAssetTimeout}`

  const text =
    !dtSymbolSelectedComputeAsset && !dtBalanceSelectedComputeAsset
      ? ''
      : hasPreviousOrderSelectedComputeAsset
      ? `You already bought the selected ${selectedComputeAssetType}, allowing you to use it without paying again${timeout}.`
      : hasDatatokenSelectedComputeAsset
      ? `You also own ${dtBalanceSelectedComputeAsset} ${dtSymbolSelectedComputeAsset} allowing you to use the selected ${selectedComputeAssetType} by spending 1 ${dtSymbolSelectedComputeAsset}, but without paying OCEAN again.`
      : `Additionally, you will buy 1 ${dtSymbolSelectedComputeAsset} for the ${selectedComputeAssetType} and immediately spend it back to the publisher and pool.`

  return `${computeAssetHelpText} ${text}`
}

export default function ButtonBuy({
  action,
  disabled,
  hasPreviousOrder,
  hasDatatoken,
  dtSymbol,
  dtBalance,
  assetType,
  assetTimeout,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  dtSymbolSelectedComputeAsset,
  dtBalanceSelectedComputeAsset,
  selectedComputeAssetType,
  selectedComputeAssetTimeout,
  onClick,
  stepText,
  isLoading,
  type
}: ButtonBuyProps): ReactElement {
  const buttonText =
    action === 'download'
      ? hasPreviousOrder
        ? 'Download'
        : `Buy ${assetTimeout === 'Forever' ? '' : ` for ${assetTimeout}`}`
      : hasPreviousOrder && hasPreviousOrderSelectedComputeAsset
      ? 'Start Compute Job'
      : `Buy Compute Job`

  return (
    <div className={styles.actions}>
      {isLoading ? (
        <Loader message={stepText} />
      ) : (
        <>
          <Button
            style="primary"
            type={type}
            onClick={onClick}
            disabled={disabled}
          >
            {buttonText}
          </Button>
          <div className={styles.help}>
            {action === 'download'
              ? getConsumeHelpText(
                  dtBalance,
                  dtSymbol,
                  hasDatatoken,
                  hasPreviousOrder,
                  assetTimeout,
                  assetType
                )
              : getComputeAssetHelpText(
                  hasPreviousOrder,
                  hasDatatoken,
                  dtSymbol,
                  dtBalance,
                  assetType,
                  assetTimeout,
                  hasPreviousOrderSelectedComputeAsset,
                  hasDatatokenSelectedComputeAsset,
                  dtSymbolSelectedComputeAsset,
                  dtBalanceSelectedComputeAsset,
                  selectedComputeAssetType,
                  selectedComputeAssetTimeout
                )}
          </div>
        </>
      )}
    </div>
  )
}
