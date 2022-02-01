import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import FileIcon from '@shared/FileIcon'
import Price from '@shared/Price'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import { useAsset } from '@context/Asset'
import { gql } from 'urql'
import { fetchData, getQueryContext } from '@utils/subgraph'
import { OrdersData } from '../../../@types/subgraph/OrdersData'
import BigNumber from 'bignumber.js'
import { useWeb3 } from '@context/Web3'
import { usePricing } from '@hooks/usePricing'
import { useConsume } from '@hooks/useConsume'
import ButtonBuy from '@shared/ButtonBuy'
import { secondsToString } from '@utils/ddo'
import AlgorithmDatasetsListForCompute from './Compute/AlgorithmDatasetsListForCompute'
import styles from './Consume.module.css'
import { useIsMounted } from '@hooks/useIsMounted'
import { Asset, FileMetadata } from '@oceanprotocol/lib'

export default function Consume({
  ddo,
  consumeDetails,
  file,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  ddo: Asset
  consumeDetails: ConsumeDetails
  file: FileMetadata
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
  isConsumable?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { accountId } = useWeb3()
  const { appConfig } = useSiteMetadata()
  const [hasPreviousOrder, setHasPreviousOrder] = useState(false)
  const [previousOrderId, setPreviousOrderId] = useState<string>()
  const { isInPurgatory, isAssetNetwork } = useAsset()
  const { buyDT, pricingStepText, pricingError, pricingIsLoading } =
    usePricing()
  const { consumeStepText, consume, consumeError, isLoading } = useConsume()
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [isConsumablePrice, setIsConsumablePrice] = useState(true)
  const [assetTimeout, setAssetTimeout] = useState('')
  const isMounted = useIsMounted()

  useEffect(() => {
    if (!ddo) return

    const { timeout } = ddo.services[0]
    setAssetTimeout(`${timeout}`)
  }, [ddo])

  useEffect(() => {
    if (!consumeDetails) return

    setIsConsumablePrice(consumeDetails.isConsumable)
  }, [consumeDetails])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (!accountId) return
    setIsDisabled(
      !isConsumable ||
        ((!isBalanceSufficient ||
          !isAssetNetwork ||
          typeof consumeStepText !== 'undefined' ||
          pricingIsLoading ||
          !isConsumablePrice) &&
          !hasPreviousOrder &&
          !hasDatatoken)
    )
  }, [
    hasPreviousOrder,
    isBalanceSufficient,
    isAssetNetwork,
    consumeStepText,
    pricingIsLoading,
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
    const error = await consume(
      ddo.id,
      ddo.services[0].datatokenAddress,
      'access',
      appConfig.marketFeeAddress,
      previousOrderId
    )
    error || setHasPreviousOrder(true)
  }

  // Output errors in UI
  useEffect(() => {
    consumeError && toast.error(consumeError)
  }, [consumeError])

  useEffect(() => {
    pricingError && toast.error(pricingError)
  }, [pricingError])

  const PurchaseButton = () => (
    <ButtonBuy
      action="download"
      disabled={isDisabled}
      hasPreviousOrder={hasPreviousOrder}
      hasDatatoken={hasDatatoken}
      dtSymbol={ddo?.datatokens[0]?.symbol}
      dtBalance={dtBalance}
      datasetLowPoolLiquidity={!isConsumablePrice}
      onClick={handleConsume}
      assetTimeout={secondsToString(parseInt(assetTimeout))}
      assetType={ddo?.metadata?.type}
      stepText={consumeStepText || pricingStepText}
      isLoading={pricingIsLoading || isLoading}
      priceType={consumeDetails?.type}
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
          <Price consumeDetails={consumeDetails} conversion />
          {!isInPurgatory && <PurchaseButton />}
        </div>
      </div>
      {ddo?.metadata?.type === 'algorithm' && (
        <AlgorithmDatasetsListForCompute algorithmDid={ddo.id} ddo={ddo} />
      )}
    </aside>
  )
}
