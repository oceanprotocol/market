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
import { buyDtFromPool, calculateBuyPrice } from '@utils/pool'
import { downloadFile } from '@utils/provider'
import { getOrderFeedback } from '@utils/feedback'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { OrderPriceAndFees } from 'src/@types/Price'
import { toast } from 'react-toastify'

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
      if (asset?.accessDetails?.addressOrId === ZERO_ADDRESS) return
      setIsLoading(true)
      setStatusText('Calculating price including fees.')
      const orderPriceAndFees = await getOrderPriceAndFees(asset, ZERO_ADDRESS)
      setOrderPriceAndFees(orderPriceAndFees)

      console.log('aset', asset.accessDetails, orderPriceAndFees)
      setIsLoading(false)
    }

    init()

    // do not add asset here `asset.accessDetails` covers all the cases, adding asset will trigger this effect a lot of times (for some reason)
  }, [asset, accountId])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (!accountId || !asset?.accessDetails) return
    setIsDisabled(
      !asset?.accessDetails.isPurchasable ||
        ((!isBalanceSufficient || !isAssetNetwork) && !isOwned && !hasDatatoken)
    )
  }, [
    asset?.accessDetails,
    isBalanceSufficient,
    isAssetNetwork,
    hasDatatoken,
    accountId,
    isOwned
  ])

  async function handleConsume() {
    setIsLoading(true)
    if (isOwned) {
      setStatusText(
        getOrderFeedback(
          asset.accessDetails.baseToken.symbol,
          asset.accessDetails.datatoken.symbol
        )[2]
      )
      await downloadFile(web3, asset, accountId, validOrderTx)
    } else {
      try {
        if (!hasDatatoken && asset.accessDetails.type === 'dynamic') {
          setStatusText(
            getOrderFeedback(
              asset.accessDetails.baseToken.symbol,
              asset.accessDetails.datatoken.symbol
            )[0]
          )
          const tx = await buyDtFromPool(asset.accessDetails, accountId, web3)
          console.log('tx', tx)

          if (!tx) {
            toast.error('Failed to buy datatoken from pool!')
            setIsLoading(false)
            return
          }
        }
        setStatusText(
          getOrderFeedback(
            asset.accessDetails.baseToken.symbol,
            asset.accessDetails.datatoken.symbol
          )[1]
        )
        const orderTx = await order(web3, asset, orderPriceAndFees, accountId)

        setIsOwned(true)
        setValidOrderTx(orderTx.transactionHash)
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
      hasPreviousOrder={isOwned}
      hasDatatoken={hasDatatoken}
      dtSymbol={asset?.datatokens[0]?.symbol}
      dtBalance={dtBalance}
      datasetLowPoolLiquidity={!asset.accessDetails?.isPurchasable}
      onClick={handleConsume}
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
