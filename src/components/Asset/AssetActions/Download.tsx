import React, { ReactElement, useEffect, useState } from 'react'
import FileIcon from '@shared/FileIcon'
import Price from '@shared/Price'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ButtonBuy from './ButtonBuy'
import { secondsToString } from '@utils/ddo'
import AlgorithmDatasetsListForCompute from './Compute/AlgorithmDatasetsListForCompute'
import styles from './Download.module.css'
import { FileInfo, LoggerInstance, ZERO_ADDRESS } from '@oceanprotocol/lib'
import { order } from '@utils/order'
import { downloadFile } from '@utils/provider'
import { getOrderFeedback } from '@utils/feedback'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { toast } from 'react-toastify'
import { useIsMounted } from '@hooks/useIsMounted'
import { useMarketMetadata } from '@context/MarketMetadata'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'

export default function Download({
  asset,
  file,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading,
  consumableFeedback
}: {
  asset: AssetExtended
  file: FileInfo
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { accountId, web3, isSupportedOceanNetwork } = useWeb3()
  const { getOpcFeeForToken } = useMarketMetadata()
  const { isInPurgatory, isAssetNetwork } = useAsset()
  const isMounted = useIsMounted()

  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPriceLoading, setIsPriceLoading] = useState(false)
  const [isOwned, setIsOwned] = useState(false)
  const [validOrderTx, setValidOrderTx] = useState('')
  const [isOrderDisabled, setIsOrderDisabled] = useState(false)
  const [orderPriceAndFees, setOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  const [retry, setRetry] = useState<boolean>(false)

  const isUnsupportedPricing =
    !asset?.accessDetails ||
    !asset.services.length ||
    asset?.stats?.price?.value === undefined ||
    asset?.accessDetails?.type === 'NOT_SUPPORTED' ||
    (asset?.accessDetails?.type === 'fixed' &&
      !asset?.accessDetails?.baseToken?.symbol)

  useEffect(() => {
    Number(asset?.nft.state) === 4 && setIsOrderDisabled(true)
  }, [asset?.nft.state])

  useEffect(() => {
    if (isUnsupportedPricing) return

    setIsOwned(asset?.accessDetails?.isOwned || false)
    setValidOrderTx(asset?.accessDetails?.validOrderTx || '')

    // get full price and fees
    async function init() {
      if (
        asset.accessDetails.addressOrId === ZERO_ADDRESS ||
        asset.accessDetails.type === 'free' ||
        isLoading
      )
        return

      !orderPriceAndFees && setIsPriceLoading(true)

      const _orderPriceAndFees = await getOrderPriceAndFees(asset, ZERO_ADDRESS)
      setOrderPriceAndFees(_orderPriceAndFees)
      !orderPriceAndFees && setIsPriceLoading(false)
    }

    init()

    /**
     * we listen to the assets' changes to get the most updated price
     * based on the asset and the poolData's information.
     * Not adding isLoading and getOpcFeeForToken because we set these here. It is a compromise
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, accountId, getOpcFeeForToken, isUnsupportedPricing])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (
      (asset?.accessDetails?.type === 'fixed' && !orderPriceAndFees) ||
      !isMounted ||
      !accountId ||
      isUnsupportedPricing
    )
      return

    /**
     * disabled in these cases:
     * - if the asset is not purchasable
     * - if the user is on the wrong network
     * - if user balance is not sufficient
     * - if user has no datatokens
     */
    const isDisabled =
      !asset?.accessDetails.isPurchasable ||
      !isAssetNetwork ||
      ((!isBalanceSufficient || !isAssetNetwork) && !isOwned && !hasDatatoken)

    setIsDisabled(isDisabled)
  }, [
    isMounted,
    asset?.accessDetails,
    isBalanceSufficient,
    isAssetNetwork,
    hasDatatoken,
    accountId,
    isOwned,
    isUnsupportedPricing,
    orderPriceAndFees
  ])

  async function handleOrderOrDownload() {
    setIsLoading(true)

    try {
      if (isOwned) {
        setStatusText(
          getOrderFeedback(
            asset.accessDetails.baseToken?.symbol,
            asset.accessDetails.datatoken?.symbol
          )[3]
        )

        await downloadFile(web3, asset, accountId, validOrderTx)
      } else {
        setStatusText(
          getOrderFeedback(
            asset.accessDetails.baseToken?.symbol,
            asset.accessDetails.datatoken?.symbol
          )[asset.accessDetails.type === 'fixed' ? 2 : 1]
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
      setRetry(true)
      const message = isOwned
        ? 'Failed to download file!'
        : 'An error occurred, please retry. Check console for more information.'
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
      btSymbol={asset?.accessDetails?.baseToken?.symbol}
      dtSymbol={asset?.datatokens[0]?.symbol}
      dtBalance={dtBalance}
      onClick={handleOrderOrDownload}
      assetTimeout={secondsToString(asset?.services?.[0]?.timeout)}
      assetType={asset?.metadata?.type}
      stepText={statusText}
      isLoading={isLoading}
      priceType={asset.accessDetails?.type}
      isConsumable={asset.accessDetails?.isPurchasable}
      isBalanceSufficient={isBalanceSufficient}
      consumableFeedback={consumableFeedback}
      retry={retry}
      isSupportedOceanNetwork={isSupportedOceanNetwork}
    />
  )

  const AssetAction = ({ asset }: { asset: AssetExtended }) => {
    return (
      <div>
        {isOrderDisabled ? (
          <Alert
            className={styles.fieldWarning}
            state="info"
            text={`The publisher temporarily disabled ordering for this asset`}
          />
        ) : (
          <>
            {isUnsupportedPricing ? (
              <Alert
                className={styles.fieldWarning}
                state="info"
                text={`No pricing schema available for this asset.`}
              />
            ) : (
              <>
                {isPriceLoading ? (
                  <Loader message="Calculating full price (including fees)" />
                ) : (
                  <Price
                    price={asset.stats?.price}
                    orderPriceAndFees={orderPriceAndFees}
                    conversion
                    size="large"
                  />
                )}

                {!isInPurgatory && <PurchaseButton />}
              </>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <FileIcon file={file} isLoading={fileIsLoading} small />
        </div>
        <AssetAction asset={asset} />
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
