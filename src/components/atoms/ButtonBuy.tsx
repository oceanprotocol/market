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
  isLoading: boolean
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
  stepText?: string
  type?: 'submit'
  priceType?: string
  algorithmPriceType?: string
  isConsumable: boolean
  consumableFeedback: string
  algorithmConsumableStatus?: number
}

function getConsumeHelpText(
  dtBalance: string,
  dtSymbol: string,
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  assetType: string,
  isConsumable: boolean,
  consumableFeedback: string
) {
  const text = !isConsumable
    ? consumableFeedback
    : hasPreviousOrder
    ? `You bought this ${assetType} already allowing you to use it without paying again.`
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
  isConsumable: boolean,
  consumableFeedback: string,
  hasPreviousOrderSelectedComputeAsset?: boolean,
  hasDatatokenSelectedComputeAsset?: boolean,
  dtSymbolSelectedComputeAsset?: string,
  dtBalanceSelectedComputeAsset?: string,
  selectedComputeAssetType?: string,
  algorithmConsumableStatus?: number
) {
  const computeAssetHelpText = getConsumeHelpText(
    dtBalance,
    dtSymbol,
    hasDatatoken,
    hasPreviousOrder,
    assetType,
    isConsumable,
    consumableFeedback
  )
  const text =
    (!dtSymbolSelectedComputeAsset && !dtBalanceSelectedComputeAsset) ||
    !isConsumable
      ? ''
      : algorithmConsumableStatus === 1
      ? 'The selected algorithm has been temporarily disabled by the publisher, please try again later.'
      : algorithmConsumableStatus === 2
      ? 'Access denied, your wallet address is not found on the selected algorithm allow list.'
      : algorithmConsumableStatus === 3
      ? 'Access denied, your wallet address is found on the selected algorithm deny list.'
      : hasPreviousOrderSelectedComputeAsset
      ? `You already bought the selected ${selectedComputeAssetType}, allowing you to use it without paying again.`
      : hasDatatokenSelectedComputeAsset
      ? `You own ${dtBalanceSelectedComputeAsset} ${dtSymbolSelectedComputeAsset} allowing you to use the selected ${selectedComputeAssetType} by spending 1 ${dtSymbolSelectedComputeAsset}, but without paying OCEAN again.`
      : `Additionally, you will buy 1 ${dtSymbolSelectedComputeAsset} for the ${selectedComputeAssetType} and spend it back to its publisher and pool.`

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
  onClick,
  stepText,
  isLoading,
  type,
  priceType,
  algorithmPriceType,
  isConsumable,
  consumableFeedback,
  algorithmConsumableStatus
}: ButtonBuyProps): ReactElement {
  const buttonText =
    action === 'download'
      ? hasPreviousOrder
        ? 'Download'
        : priceType === 'free'
        ? 'Get'
        : `Buy ${assetTimeout === 'Forever' ? '' : ` for ${assetTimeout}`}`
      : hasPreviousOrder && hasPreviousOrderSelectedComputeAsset
      ? 'Start Compute Job'
      : priceType === 'free' && algorithmPriceType === 'free'
      ? 'Order Compute Job'
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
                  assetType,
                  isConsumable,
                  consumableFeedback
                )
              : getComputeAssetHelpText(
                  hasPreviousOrder,
                  hasDatatoken,
                  dtSymbol,
                  dtBalance,
                  assetType,
                  hasPreviousOrderSelectedComputeAsset,
                  hasDatatokenSelectedComputeAsset,
                  dtSymbolSelectedComputeAsset,
                  dtBalanceSelectedComputeAsset,
                  selectedComputeAssetType,
                  isConsumable,
                  consumableFeedback,
                  algorithmConsumableStatus
                )}
          </div>
        </>
      )}
    </div>
  )
}
