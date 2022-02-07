import React, { ReactElement, useEffect, useState } from 'react'
import FileIcon from '@shared/FileIcon'
import Price from '@shared/Price'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ButtonBuy from '@shared/ButtonBuy'
import { secondsToString } from '@utils/ddo'
import AlgorithmDatasetsListForCompute from './Compute/AlgorithmDatasetsListForCompute'
import styles from './Download.module.css'
import { useIsMounted } from '@hooks/useIsMounted'
import { FileMetadata } from '@oceanprotocol/lib'
import { order } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'
import { calculateBuyPrice } from '@utils/pool'

export default function Download({
  asset,
  accessDetails,
  file,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  asset: AssetExtended
  accessDetails: AccessDetails
  file: FileMetadata
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
  isConsumable?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { accountId, web3 } = useWeb3()
  const [hasPreviousOrder, setHasPreviousOrder] = useState(false)
  const [previousOrderId, setPreviousOrderId] = useState<string>()
  const { isInPurgatory, isAssetNetwork } = useAsset()
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [isConsumablePrice, setIsConsumablePrice] = useState(true)
  const [assetTimeout, setAssetTimeout] = useState('')
  const isMounted = useIsMounted()

  useEffect(() => {
    if (!asset) return

    const { timeout } = asset.services[0]
    setAssetTimeout(`${timeout}`)
  }, [asset])

  useEffect(() => {
    if (!accessDetails) return
    async function init() {
      if (accessDetails.type === 'dynamic') {
        const priceAndEstimate = await calculateBuyPrice(
          accessDetails.addressOrId,
          accessDetails.price,
          accessDetails.baseToken.address,
          accessDetails.datatoken.address,
          null,
          asset.chainId
        )
        accessDetails.price = Number.parseFloat(priceAndEstimate.price)
      }
    }

    setIsConsumablePrice(accessDetails.isConsumable)
    setHasPreviousOrder(accessDetails.owned)
    setPreviousOrderId(accessDetails.validOrderTx)
    init()
  }, [accessDetails, asset.chainId])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (!accountId) return
    setIsDisabled(
      !isConsumable ||
        ((!isBalanceSufficient || !isAssetNetwork || !isConsumablePrice) &&
          !hasPreviousOrder &&
          !hasDatatoken)
    )
  }, [
    hasPreviousOrder,
    isBalanceSufficient,
    isAssetNetwork,

    isConsumablePrice,
    hasDatatoken,
    isConsumable,
    accountId
  ])

  async function handleConsume() {
    // if (!hasPreviousOrder && !hasDatatoken) {
    //   const tx = await buyDT('1', price, ddo)
    //   if (tx === undefined) return
    // }
    const tx = await order(web3, asset, accountId)
  }

  const PurchaseButton = () => (
    <ButtonBuy
      action="download"
      disabled={isDisabled}
      hasPreviousOrder={hasPreviousOrder}
      hasDatatoken={hasDatatoken}
      dtSymbol={asset?.datatokens[0]?.symbol}
      dtBalance={dtBalance}
      datasetLowPoolLiquidity={!isConsumablePrice}
      onClick={handleConsume}
      assetTimeout={secondsToString(parseInt(assetTimeout))}
      assetType={asset?.metadata?.type}
      // stepText={consumeStepText || pricingStepText}
      // isLoading={pricingIsLoading || isLoading}
      stepText=""
      isLoading={false}
      priceType={accessDetails?.type}
      isConsumable={isConsumable}
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
