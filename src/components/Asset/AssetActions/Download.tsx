import React, { ReactElement, useEffect, useState } from 'react'
import FileIcon from '@shared/FileIcon'
import Price from '@shared/Price'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ButtonBuy from '@shared/ButtonBuy'
import { secondsToString } from '@utils/ddo'
import AlgorithmDatasetsListForCompute from './Compute/AlgorithmDatasetsListForCompute'
import styles from './Download.module.css'
import { FileMetadata, LoggerInstance, ZERO_ADDRESS } from '@oceanprotocol/lib'
import { order } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'
import { buyDtFromPool } from '@utils/pool'
import { downloadFile } from '@utils/provider'
import { getOrderFeedback } from '@utils/feedback'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { OrderPriceAndFees } from 'src/@types/Price'
import { toast } from 'react-toastify'
import { useIsMounted } from '@hooks/useIsMounted'

export default function Download({
  asset,
  file,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading,
  consumableFeedback
}: {
  asset: AssetExtended
  file: FileMetadata
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { accountId, web3 } = useWeb3()
  const { isInPurgatory, isAssetNetwork } = useAsset()
  const isMounted = useIsMounted()

  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOwned, setIsOwned] = useState(false)
  const [validOrderTx, setValidOrderTx] = useState('')

  const [orderPriceAndFees, setOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  useEffect(() => {
    if (!asset?.accessDetails) return

    setIsOwned(asset?.accessDetails?.isOwned)
    setValidOrderTx(asset?.accessDetails?.validOrderTx)
    // get full price and fees
    async function init() {
      if (
        asset?.accessDetails?.addressOrId === ZERO_ADDRESS ||
        asset?.accessDetails?.type === 'free'
      )
        return
      setIsLoading(true)
      setStatusText('Calculating price including fees.')
      const orderPriceAndFees = await getOrderPriceAndFees(asset, ZERO_ADDRESS)
      setOrderPriceAndFees(orderPriceAndFees)

      setIsLoading(false)
    }

    init()
  }, [asset, accountId])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (!isMounted || !accountId || !asset?.accessDetails) return

    const isDisabled =
      !asset?.accessDetails.isPurchasable ||
      ((!isBalanceSufficient || !isAssetNetwork) && !isOwned && !hasDatatoken)
    setIsDisabled(isDisabled)
  }, [
    isMounted,
    asset?.accessDetails,
    isBalanceSufficient,
    isAssetNetwork,
    hasDatatoken,
    accountId,
    isOwned
  ])

  async function handleOrderOrDownload() {
    setIsLoading(true)
    try {
      if (isOwned) {
        setStatusText(
          getOrderFeedback(
            asset.accessDetails?.baseToken?.symbol,
            asset.accessDetails?.datatoken?.symbol
          )[3]
        )

        await downloadFile(web3, asset, accountId, validOrderTx)
      } else {
        if (!hasDatatoken && asset.accessDetails.type === 'dynamic') {
          setStatusText(
            getOrderFeedback(
              asset.accessDetails.baseToken?.symbol,
              asset.accessDetails.datatoken?.symbol
            )[0]
          )
          const tx = await buyDtFromPool(asset.accessDetails, accountId, web3)
          if (!tx) {
            throw new Error()
          }
        }
        setStatusText(
          getOrderFeedback(
            asset.accessDetails.baseToken?.symbol,
            asset.accessDetails.datatoken?.symbol
          )[asset.accessDetails?.type === 'fixed' ? 2 : 1]
        )
        const orderTx = await order(web3, asset, orderPriceAndFees, accountId)
        if (!orderTx) {
          throw new Error()
        }
        setIsOwned(true)
        setValidOrderTx(orderTx.transactionHash)
      }
    } catch (error) {
      LoggerInstance.error(error)
      const message = isOwned
        ? 'Failed to download file!'
        : 'Failed to buy datatoken from pool!'
      toast.error(message)
    }
    setIsLoading(false)
  }

  const PurchaseButton = () => (
    <ButtonBuy
      action="download"
      disabled={isDisabled}
      hasPreviousOrder={isOwned}
      hasDatatoken={hasDatatoken}
      dtSymbol={asset?.datatokens[0]?.symbol}
      dtBalance={dtBalance}
      datasetLowPoolLiquidity={!asset.accessDetails?.isPurchasable}
      onClick={handleOrderOrDownload}
      assetTimeout={secondsToString(asset.services[0].timeout)}
      assetType={asset?.metadata?.type}
      stepText={statusText}
      // isLoading={pricingIsLoading || isLoading}
      isLoading={isLoading}
      priceType={asset.accessDetails?.type}
      isConsumable={asset.accessDetails?.isPurchasable}
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
          <Price
            accessDetails={asset.accessDetails}
            orderPriceAndFees={orderPriceAndFees}
            conversion
            size="large"
          />
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
