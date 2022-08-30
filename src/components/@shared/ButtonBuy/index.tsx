/* eslint-disable prettier/prettier */
import React, { FormEvent, ReactElement } from 'react'
import Button from '../atoms/Button'
import styles from './index.module.css'
import Loader from '../atoms/Loader'
import StreamSubs from 'src/components/Asset/AssetContent/StreamSubs'
import Copy from '@shared/atoms/Copy'

interface ButtonBuyProps {
  action: 'download' | 'compute' | 'stream'
  disabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  btSymbol: string
  dtSymbol: string
  dtBalance: string
  assetType: string
  assetTimeout: string
  isConsumable: boolean
  isStreamble: boolean
  consumableFeedback: string
  hasPreviousOrderSelectedComputeAsset?: boolean
  hasDatatokenSelectedComputeAsset?: boolean
  dtSymbolSelectedComputeAsset?: string
  dtBalanceSelectedComputeAsset?: string
  selectedComputeAssetType?: string
  isBalanceSufficient: boolean
  isLoading?: boolean
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
  stepText?: string
  copyText?: string
  type?: 'submit'
  priceType?: string
  algorithmPriceType?: string
  isAlgorithmConsumable?: boolean
  hasProviderFee?: boolean
}

// TODO: we need to take a look at these messages

function getStreamHelpText(
  btSymbol: string,
  dtBalance: string,
  dtSymbol: string,
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  assetType: string,
  isConsumable: boolean,
  isStreamable: boolean,
  isBalanceSufficient: boolean,
  streamableFeedback: string
) {
  const text =
    isStreamable === false
      ? streamableFeedback
      : hasPreviousOrder
      ? `You procured the subscription for this ${assetType} and can access it until the time limit expires.`
      : hasDatatoken
      ? `You own ${dtBalance} ${dtSymbol} allowing you to subsribe to this ${assetType} by spending 1 ${dtSymbol}, but without paying ${btSymbol} again.`
      : isBalanceSufficient === false
      ? `You do not have enough ${btSymbol} in your wallet to subsribe to this ${assetType}.`
      : `For using this ${assetType}, you will buy 1 ${dtSymbol} and immediately spend it back to the publisher.`
  return text
}

function getConsumeHelpText(
  btSymbol: string,
  dtBalance: string,
  dtSymbol: string,
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  assetType: string,
  isConsumable: boolean,
  isBalanceSufficient: boolean,
  consumableFeedback: string
) {
  const text =
    isConsumable === false
      ? consumableFeedback
      : hasPreviousOrder
      ? `You bought this ${assetType} already allowing you to use it without paying again.`
      : hasDatatoken
      ? `You own ${dtBalance} ${dtSymbol} allowing you to use this dataset by spending 1 ${dtSymbol}, but without paying ${btSymbol} again.`
      : isBalanceSufficient === false
      ? `You do not have enough ${btSymbol} in your wallet to purchase this asset.`
      : `For using this ${assetType}, you will buy 1 ${dtSymbol} and immediately spend it back to the publisher.`
  return text
}

function getComputeAssetHelpText(
  hasPreviousOrder: boolean,
  hasDatatoken: boolean,
  btSymbol: string,
  dtSymbol: string,
  dtBalance: string,
  isConsumable: boolean,
  consumableFeedback: string,
  isBalanceSufficient: boolean,
  hasPreviousOrderSelectedComputeAsset?: boolean,
  hasDatatokenSelectedComputeAsset?: boolean,
  assetType?: string,
  dtSymbolSelectedComputeAsset?: string,
  dtBalanceSelectedComputeAsset?: string,
  selectedComputeAssetType?: string,
  isAlgorithmConsumable?: boolean,
  hasProviderFee?: boolean
) {
  const computeAssetHelpText = getConsumeHelpText(
    btSymbol,
    dtBalance,
    dtSymbol,
    hasDatatoken,
    hasPreviousOrder,
    assetType,
    isConsumable,
    isBalanceSufficient,
    consumableFeedback
  )

  const computeAlgoHelpText =
    (!dtSymbolSelectedComputeAsset && !dtBalanceSelectedComputeAsset) ||
    isConsumable === false ||
    isAlgorithmConsumable === false
      ? ''
      : hasPreviousOrderSelectedComputeAsset
      ? `You already bought the selected ${selectedComputeAssetType}, allowing you to use it without paying again.`
      : hasDatatokenSelectedComputeAsset
      ? `You own ${dtBalanceSelectedComputeAsset} ${dtSymbolSelectedComputeAsset} allowing you to use the selected ${selectedComputeAssetType} by spending 1 ${dtSymbolSelectedComputeAsset}, but without paying ${btSymbol} again.`
      : isBalanceSufficient === false
      ? ''
      : `Additionally, you will buy 1 ${dtSymbolSelectedComputeAsset} for the ${selectedComputeAssetType} and spend it back to its publisher.`
  const providerFeeHelpText = hasProviderFee
    ? 'In order to start the job you also need to pay the fees for renting the c2d resources.'
    : 'C2D resources required to start the job are available, no payment required for those fees.'
  const computeHelpText = `${computeAssetHelpText} ${computeAlgoHelpText} ${providerFeeHelpText}`
  return computeHelpText
}

export default function ButtonBuy({
  action,
  disabled,
  hasPreviousOrder,
  hasDatatoken,
  btSymbol,
  dtSymbol,
  dtBalance,
  assetType,
  assetTimeout,
  isConsumable,
  isStreamble,
  consumableFeedback,
  isBalanceSufficient,
  hasPreviousOrderSelectedComputeAsset,
  hasDatatokenSelectedComputeAsset,
  dtSymbolSelectedComputeAsset,
  dtBalanceSelectedComputeAsset,
  selectedComputeAssetType,
  onClick,
  stepText,
  copyText,
  isLoading,
  type,
  priceType,
  algorithmPriceType,
  isAlgorithmConsumable,
  hasProviderFee
}: ButtonBuyProps): ReactElement {
  const buttonText =
    action === 'download'
      ? hasPreviousOrder
        ? 'Download'
        : priceType === 'free'
        ? 'Get'
        : `Buy ${assetTimeout === 'Forever' ? '' : ` for ${assetTimeout}`}`
      : hasPreviousOrder &&
        hasPreviousOrderSelectedComputeAsset &&
        !hasProviderFee
      ? 'Start Compute Job'
      : priceType === 'free' && algorithmPriceType === 'free'
      ? 'Order Compute Job'
      : `Buy Compute Job`

  const buttonStreamText =
    action === 'stream'
      ? hasPreviousOrder
        ? 'Copy Feed URL'
        : priceType === 'free'
        ? 'Get'
        : `Subscribe ${
            assetTimeout === 'Forever' ? '' : ` for ${assetTimeout}`
          }`
      : ``

  return (
    <div className={styles.actions}>
      {isLoading ? (
        <Loader message={stepText} />
      ) : (
        <>
          {action === 'stream' ? (
            <Button
              style="primary"
              type={type}
              onClick={onClick}
              disabled={disabled}
              className={styles.actionsCenter}
            >
              {buttonStreamText}
            </Button>
          ) : (
            <Button
              style="primary"
              type={type}
              onClick={onClick}
              disabled={disabled}
              className={action === 'compute' ? styles.actionsCenter : ''}
            >
              {/* {buttonText} */}
              {buttonText}
            </Button>
          )}

          <StreamSubs />
          <div className={styles.help}>
            {action === 'download'
              ? getConsumeHelpText(
                  btSymbol,
                  dtBalance,
                  dtSymbol,
                  hasDatatoken,
                  hasPreviousOrder,
                  assetType,
                  isConsumable,
                  isBalanceSufficient,
                  consumableFeedback
                )
              : action === 'stream'
              ? getStreamHelpText(
                  btSymbol,
                  dtBalance,
                  dtSymbol,
                  hasDatatoken,
                  hasPreviousOrder,
                  assetType,
                  isConsumable,
                  isStreamble,
                  isBalanceSufficient,
                  consumableFeedback
                )
              : getComputeAssetHelpText(
                  hasPreviousOrder,
                  hasDatatoken,
                  btSymbol,
                  dtSymbol,
                  dtBalance,
                  isConsumable,
                  consumableFeedback,
                  isBalanceSufficient,
                  hasPreviousOrderSelectedComputeAsset,
                  hasDatatokenSelectedComputeAsset,
                  assetType,
                  dtSymbolSelectedComputeAsset,
                  dtBalanceSelectedComputeAsset,
                  selectedComputeAssetType,
                  isAlgorithmConsumable,
                  hasProviderFee
                )}
          </div>
        </>
      )}
    </div>
  )
}
