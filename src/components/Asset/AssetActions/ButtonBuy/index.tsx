import React, { FormEvent, ReactElement } from 'react'
import Button from '../../../@shared/atoms/Button'
import styles from './index.module.css'
import Loader from '../../../@shared/atoms/Loader'
import { useWeb3 } from '@context/Web3'
import Web3 from 'web3'

export interface ButtonBuyProps {
  action: 'download' | 'compute'
  disabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  btSymbol: string
  dtSymbol: string
  dtBalance: string
  assetType: string
  assetTimeout: string
  isConsumable: boolean
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
  type?: 'submit'
  priceType?: string
  algorithmPriceType?: string
  isAlgorithmConsumable?: boolean
  isSupportedOceanNetwork?: boolean
  hasProviderFee?: boolean
  retry?: boolean
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
  consumableFeedback: string,
  isSupportedOceanNetwork: boolean,
  web3: Web3,
  priceType: string
) {
  const text =
    isConsumable === false
      ? consumableFeedback
      : hasPreviousOrder && web3 && isSupportedOceanNetwork
      ? `You bought this ${assetType} already allowing you to use it without paying again.`
      : hasDatatoken
      ? `You own ${dtBalance} ${dtSymbol} allowing you to use this dataset by spending 1 ${dtSymbol}, but without paying ${btSymbol} again.`
      : isBalanceSufficient === false
      ? `You do not have enough ${btSymbol} in your wallet to purchase this asset.`
      : priceType === 'free'
      ? `This ${assetType} is free to use.`
      : `To use this ${assetType}, you will buy 1 ${dtSymbol} and immediately send it back to the publisher.`
  return text
}

function getAlgoHelpText(
  dtSymbolSelectedComputeAsset: string,
  dtBalanceSelectedComputeAsset: string,
  isConsumable: boolean,
  isAlgorithmConsumable: boolean,
  hasPreviousOrderSelectedComputeAsset: boolean,
  selectedComputeAssetType: string,
  hasDatatokenSelectedComputeAsset: boolean,
  isBalanceSufficient: boolean,
  isSupportedOceanNetwork: boolean,
  web3: Web3,
  algorithmPriceType: string
) {
  const text =
    (!dtSymbolSelectedComputeAsset && !dtBalanceSelectedComputeAsset) ||
    isConsumable === false ||
    isAlgorithmConsumable === false
      ? ''
      : hasPreviousOrderSelectedComputeAsset && web3 && isSupportedOceanNetwork
      ? `You already bought the selected ${selectedComputeAssetType}, allowing you to use it without paying again.`
      : hasDatatokenSelectedComputeAsset
      ? `You own ${dtBalanceSelectedComputeAsset} ${dtSymbolSelectedComputeAsset} allowing you to use the selected ${selectedComputeAssetType} by spending 1 ${dtSymbolSelectedComputeAsset}, but without paying OCEAN again.`
      : web3 && !isSupportedOceanNetwork
      ? `Connect to the correct network to interact with this asset.`
      : isBalanceSufficient === false
      ? ''
      : algorithmPriceType === 'free'
      ? `Additionally, the selected ${selectedComputeAssetType} is free to use.`
      : `Additionally, you will buy 1 ${dtSymbolSelectedComputeAsset} for the ${selectedComputeAssetType} and send it back to the publisher.`
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
  algorithmPriceType: string,
  priceType: string,
  hasPreviousOrderSelectedComputeAsset?: boolean,
  hasDatatokenSelectedComputeAsset?: boolean,
  assetType?: string,
  dtSymbolSelectedComputeAsset?: string,
  dtBalanceSelectedComputeAsset?: string,
  selectedComputeAssetType?: string,
  isAlgorithmConsumable?: boolean,
  isSupportedOceanNetwork?: boolean,
  web3?: Web3,
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
    consumableFeedback,
    isSupportedOceanNetwork,
    web3,
    priceType
  )

  const computeAlgoHelpText = getAlgoHelpText(
    dtSymbolSelectedComputeAsset,
    dtBalanceSelectedComputeAsset,
    isConsumable,
    isAlgorithmConsumable,
    hasPreviousOrderSelectedComputeAsset,
    selectedComputeAssetType,
    hasDatatokenSelectedComputeAsset,
    isBalanceSufficient,
    isSupportedOceanNetwork,
    web3,
    algorithmPriceType
  )

  const providerFeeHelpText = hasProviderFee
    ? 'In order to start the job you also need to pay the fees for renting the c2d resources.'
    : 'The C2D resources required to start the job are available, no payment is required for them.'
  let computeHelpText = `${computeAssetHelpText} ${computeAlgoHelpText} ${providerFeeHelpText}`

  computeHelpText = computeHelpText.replace(/^\s+/, '')
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
  consumableFeedback,
  isBalanceSufficient,
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
  isAlgorithmConsumable,
  hasProviderFee,
  retry,
  isSupportedOceanNetwork
}: ButtonBuyProps): ReactElement {
  const { web3 } = useWeb3()
  const buttonText = retry
    ? 'Retry'
    : action === 'download'
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

  function message(): string {
    let message = ''
    if (action === 'download') {
      message = getConsumeHelpText(
        btSymbol,
        dtBalance,
        dtSymbol,
        hasDatatoken,
        hasPreviousOrder,
        assetType,
        isConsumable,
        isBalanceSufficient,
        consumableFeedback,
        isSupportedOceanNetwork,
        web3,
        priceType
      )
    } else {
      message = getComputeAssetHelpText(
        hasPreviousOrder,
        hasDatatoken,
        btSymbol,
        dtSymbol,
        dtBalance,
        isConsumable,
        consumableFeedback,
        isBalanceSufficient,
        algorithmPriceType,
        priceType,
        hasPreviousOrderSelectedComputeAsset,
        hasDatatokenSelectedComputeAsset,
        assetType,
        dtSymbolSelectedComputeAsset,
        dtBalanceSelectedComputeAsset,
        selectedComputeAssetType,
        isAlgorithmConsumable,
        isSupportedOceanNetwork,
        web3,
        hasProviderFee
      )
    }
    if (priceType === 'free' || algorithmPriceType === 'free') {
      message +=
        ' Please note that network gas fees still apply, even when using free assets.'
    }
    return message
  }
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
            className={action === 'compute' ? styles.actionsCenter : ''}
          >
            {buttonText}
          </Button>
          <div className={styles.help}>{message()}</div>
        </>
      )}
    </div>
  )
}
