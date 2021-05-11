import React, { FormEvent, ReactElement } from 'react'
import Button from './Button'
import styles from './ButtonBuy.module.css'
import Loader from './Loader'
import Status from './Status'
import Tooltip from './Tooltip'

interface ButtonBuyProps {
  action: 'download' | 'compute'
  disabled: boolean
  fileConnectivity: boolean
  algorithmFileConnectivity?: boolean
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
}

function getConnectivityHelpText(
  action: string,
  fileConnectivity: boolean,
  algorithmFileConnectivity: boolean,
  dtSymbolSelectedComputeAsset: string
) {
  let offlineAsset: string

  if (action === 'download') {
    if (fileConnectivity === undefined) {
      return <Loader message="Checking dataset connectivity" />
    } else if (!fileConnectivity) {
      offlineAsset = 'Dataset'
    }
  } else if (action === 'compute') {
    if (fileConnectivity === undefined)
      return <Loader message="Checking dataset connectivity" />
    if (!dtSymbolSelectedComputeAsset && fileConnectivity) return
    if (dtSymbolSelectedComputeAsset && algorithmFileConnectivity === undefined)
      return <Loader message="Checking selected algorithm connectivity" />
    offlineAsset = `${
      !fileConnectivity && algorithmFileConnectivity === false
        ? 'Dataset and Algorithm'
        : !fileConnectivity
        ? `Dataset`
        : `Algorithm`
    }`
  }

  return (
    <div className={styles.connectivitywrapper}>
      <Tooltip
        content={`${offlineAsset} file endpoint appears to be offline, please come back and try again later`}
      >
        <Status className={styles.status} state="error" />
        <span
          className={styles.text}
        >{`${offlineAsset} is offline and unavailable for consume`}</span>
      </Tooltip>
    </div>
  )
}

function getConsumeHelpText(
  dtBalance: string,
  dtSymbol: string,
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  assetType: string
) {
  const text = hasPreviousOrder
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
  hasPreviousOrderSelectedComputeAsset?: boolean,
  hasDatatokenSelectedComputeAsset?: boolean,
  dtSymbolSelectedComputeAsset?: string,
  dtBalanceSelectedComputeAsset?: string,
  selectedComputeAssetType?: string
) {
  const computeAssetHelpText = getConsumeHelpText(
    dtBalance,
    dtSymbol,
    hasDatatoken,
    hasPreviousOrder,
    assetType
  )
  const text =
    !dtSymbolSelectedComputeAsset && !dtBalanceSelectedComputeAsset
      ? ''
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
  fileConnectivity,
  algorithmFileConnectivity,
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
            {!fileConnectivity ||
            (!algorithmFileConnectivity && action === 'compute')
              ? getConnectivityHelpText(
                  action,
                  fileConnectivity,
                  algorithmFileConnectivity,
                  dtSymbolSelectedComputeAsset
                )
              : action === 'download'
              ? getConsumeHelpText(
                  dtBalance,
                  dtSymbol,
                  hasDatatoken,
                  hasPreviousOrder,
                  assetType
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
                  selectedComputeAssetType
                )}
          </div>
        </>
      )}
    </div>
  )
}
