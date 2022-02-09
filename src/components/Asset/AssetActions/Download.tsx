import React, { ReactElement, useEffect, useState } from 'react'
import FileIcon from '@shared/FileIcon'
import Price from '@shared/Price'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ButtonBuy from '@shared/ButtonBuy'
import { secondsToString } from '@utils/ddo'
import AlgorithmDatasetsListForCompute from './Compute/AlgorithmDatasetsListForCompute'
import styles from './Download.module.css'
import { FileMetadata, LoggerInstance } from '@oceanprotocol/lib'
import { order } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'
import { buyDtFromPool, calculateBuyPrice } from '@utils/pool'
import { getOceanConfig } from '@utils/ocean'
import { downloadFile } from '@utils/provider'
import { orderFeedback } from '@utils/feedback'

export default function Download({
  asset,
  file,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  asset: AssetExtended
  file: FileMetadata
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
  isConsumable?: boolean
  consumableFeedback?: string
}): ReactElement {
  const [accessDetails, setAccessDetails] = useState<AccessDetails>()
  const { accountId, web3, chainId } = useWeb3()
  const { isInPurgatory, isAssetNetwork } = useAsset()
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!asset || !asset.accessDetails) return

    setAccessDetails(asset.accessDetails)
  }, [asset])

  useEffect(() => {
    if (!accessDetails) return
    async function init() {
      if (accessDetails.type === 'dynamic') {
        const priceAndEstimate = await calculateBuyPrice(
          accessDetails,
          null,
          asset.chainId
        )
        accessDetails.price = Number.parseFloat(priceAndEstimate.price)
      }
    }
    init()
  }, [accessDetails, asset?.chainId])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (!accountId || !accessDetails) return
    setIsDisabled(
      !accessDetails.isPurchasable ||
        ((!isBalanceSufficient || !isAssetNetwork) &&
          !accessDetails.isOwned &&
          !hasDatatoken)
    )
  }, [
    accessDetails,
    isBalanceSufficient,
    isAssetNetwork,
    hasDatatoken,
    isConsumable,
    accountId
  ])

  async function handleConsume() {
    setIsLoading(true)
    if (accessDetails.isOwned) {
      setStatusText(orderFeedback[2])
      await downloadFile(web3, asset, accountId)
    } else {
      try {
        if (!hasDatatoken && accessDetails.type === 'dynamic') {
          setStatusText(orderFeedback[0])
          const config = getOceanConfig(chainId)
          const tx = await buyDtFromPool(accessDetails, accountId, config, web3)
          dtBalance = dtBalance + 1
          if (tx === undefined) return
        }
        setStatusText(orderFeedback[1])
        const orderTx = await order(web3, asset, accountId)

        accessDetails.isOwned = true
        accessDetails.validOrderTx = orderTx.transactionHash
      } catch (ex) {
        LoggerInstance.log(ex)
        setIsLoading(false)
      }
    }

    setIsLoading(false)
  }

  const PurchaseButton = () => (
    <ButtonBuy
      action="download"
      disabled={isDisabled}
      hasPreviousOrder={accessDetails?.isOwned}
      hasDatatoken={hasDatatoken}
      dtSymbol={asset?.datatokens[0]?.symbol}
      dtBalance={dtBalance}
      datasetLowPoolLiquidity={accessDetails?.isPurchasable}
      onClick={handleConsume}
      assetTimeout={secondsToString(asset.services[0].timeout)}
      assetType={asset?.metadata?.type}
      stepText={statusText}
      // isLoading={pricingIsLoading || isLoading}
      isLoading={isLoading}
      priceType={accessDetails?.type}
      isConsumable={accessDetails?.isPurchasable}
      isBalanceSufficient={isBalanceSufficient}
      consumableFeedback={consumableFeedback}
    />
  )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <FileIcon file={file} isLoading={fileIsLoading} />
        </div>
        <div className={styles.pricewrapper}>
          <Price accessDetails={accessDetails} conversion />
          {!isInPurgatory && <PurchaseButton />}
        </div>
      </div>
      {asset?.metadata?.type === 'algorithm' && (
        <AlgorithmDatasetsListForCompute
          algorithmDid={asset.id}
          asset={asset}
        />
      )}
    </aside>
  )
}
