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
  web3: Web3
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
      : `For using this ${assetType}, you will buy 1 ${dtSymbol} and immediately spend it back to the publisher.`
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
  web3: Web3
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
      : `Additionally, you will buy 1 ${dtSymbolSelectedComputeAsset} for the ${selectedComputeAssetType} and spend it back to its publisher and pool.`
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
    web3
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
    web3
  )

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
                  consumableFeedback,
                  isSupportedOceanNetwork,
                  web3
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
                  isSupportedOceanNetwork,
                  web3,
                  hasProviderFee
                )}
          </div>
        </>
      )}
    </div>
  )
}
