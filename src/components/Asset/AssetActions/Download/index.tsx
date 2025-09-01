import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import FileIcon from '@shared/FileIcon'
import Price from '@shared/Price'
import { useAsset } from '@context/Asset'
import ButtonBuy from '../ButtonBuy'
import { secondsToString } from '@utils/ddo'
import styles from './index.module.css'
import {
  FileInfo,
  LoggerInstance,
  UserCustomParameters,
  ZERO_ADDRESS
} from '@oceanprotocol/lib'
import { order } from '@utils/order'
import { downloadFile } from '@utils/provider'
import { getOrderFeedback } from '@utils/feedback'
import {
  getAvailablePrice,
  getOrderPriceAndFees
} from '@utils/accessDetailsAndPricing'
import { toast } from 'react-toastify'
import { useIsMounted } from '@hooks/useIsMounted'
import { useMarketMetadata } from '@context/MarketMetadata'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'
import useNetworkMetadata from '@hooks/useNetworkMetadata'
import ConsumerParameters, {
  parseConsumerParameterValues
} from '../ConsumerParameters'
import { Form, Formik, useFormikContext } from 'formik'
import { getDownloadValidationSchema } from './_validation'
import { getDefaultValues } from '../ConsumerParameters/FormConsumerParameters'
import { useAppKitAccount } from '@reown/appkit/react'
import { useSigner } from '@hooks/useSigner'

// Cache for pricing data
const priceCache = new Map<string, OrderPriceAndFees>()

export default React.memo(function Download({
  asset,
  file,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading,
  accessDetails
}: {
  asset: AssetExtended
  file: FileInfo
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
  accessDetails?: AccessDetails
}): ReactElement {
  const { address: accountId, isConnected } = useAppKitAccount()
  const { signer } = useSigner()
  const { isSupportedOceanNetwork } = useNetworkMetadata()
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
  const [assetPrice, setAssetPrice] = useState<any>(null)
  const [orderPriceAndFees, setOrderPriceAndFees] =
    useState<OrderPriceAndFees>()
  const [retry, setRetry] = useState<boolean>(false)

  const isUnsupportedPricing =
    !accessDetails ||
    !asset.services.length ||
    accessDetails?.type === 'NOT_SUPPORTED' ||
    (accessDetails?.type === 'fixed' && !accessDetails?.baseToken?.symbol)

  // Memoized price fetching
  const fetchPriceAndFees = useCallback(async () => {
    if (
      isUnsupportedPricing ||
      accessDetails.addressOrId === ZERO_ADDRESS ||
      accessDetails.type === 'free'
    )
      return

    const cacheKey = `${asset.id}-${accessDetails.addressOrId}`
    if (priceCache.has(cacheKey)) {
      setOrderPriceAndFees(priceCache.get(cacheKey))
      return
    }

    try {
      setIsPriceLoading(true)
      const _orderPriceAndFees = await getOrderPriceAndFees(
        asset,
        asset.services[0],
        accessDetails,
        ZERO_ADDRESS
      )
      if (isMounted()) {
        setOrderPriceAndFees(_orderPriceAndFees)
        priceCache.set(cacheKey, _orderPriceAndFees)
      }
    } catch (error) {
      LoggerInstance.error('getOrderPriceAndFees', error)
    } finally {
      if (isMounted()) setIsPriceLoading(false)
    }
  }, [accessDetails, isUnsupportedPricing, isMounted])

  // Initialize pricing and ownership
  useEffect(() => {
    if (isUnsupportedPricing) return

    setAssetPrice(getAvailablePrice(accessDetails))
    setIsOwned(accessDetails?.isOwned || false)
    setValidOrderTx(accessDetails?.validOrderTx || '')
    setIsOrderDisabled(Number(asset?.indexedMetadata?.nft.state) === 4)

    fetchPriceAndFees()
  }, [
    accessDetails,
    asset?.indexedMetadata?.nft.state,
    isUnsupportedPricing,
    fetchPriceAndFees
  ])

  // Update datatoken status
  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  // Update disabled state
  useEffect(() => {
    if (isUnsupportedPricing || !isMounted || !accountId) return

    const isDisabled =
      !accessDetails?.isPurchasable ||
      !isAssetNetwork ||
      ((!isBalanceSufficient || !isAssetNetwork) && !isOwned && !hasDatatoken)

    if (isMounted()) setIsDisabled(isDisabled)
  }, [
    isMounted,
    isBalanceSufficient,
    isAssetNetwork,
    hasDatatoken,
    accountId,
    isOwned,
    isUnsupportedPricing
  ])

  // Handle order or download with retry logic
  const handleOrderOrDownload = useCallback(
    async (dataParams?: UserCustomParameters, attempt = 1, maxAttempts = 3) => {
      setIsLoading(true)
      setRetry(false)

      try {
        if (isOwned) {
          setStatusText(
            getOrderFeedback(
              accessDetails.baseToken?.symbol,
              accessDetails.datatoken?.symbol
            )[3]
          )
          await downloadFile(signer, asset, accountId, validOrderTx, dataParams)
        } else {
          setStatusText(
            getOrderFeedback(
              accessDetails.baseToken?.symbol,
              accessDetails.datatoken?.symbol
            )[accessDetails.type === 'fixed' ? 2 : 1]
          )
          const orderTx = await order(
            signer,
            asset,
            orderPriceAndFees,
            accountId,
            hasDatatoken
          )
          const tx = await orderTx.wait()
          if (!tx) throw new Error()
          if (isMounted()) {
            setIsOwned(true)
            setValidOrderTx(tx.hash)
          }
        }
      } catch (error) {
        LoggerInstance.error(error)
        if (attempt < maxAttempts) {
          const delay = Math.pow(2, attempt) * 1000 // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay))
          return handleOrderOrDownload(dataParams, attempt + 1, maxAttempts)
        }
        setRetry(true)
        toast.error(
          isOwned
            ? 'Failed to download file!'
            : 'An error occurred, please retry.'
        )
      } finally {
        if (isMounted()) setIsLoading(false)
      }
    },
    [
      isOwned,
      accessDetails,
      signer,
      asset,
      accountId,
      validOrderTx,
      orderPriceAndFees,
      hasDatatoken,
      isMounted
    ]
  )

  const PurchaseButton = ({ isValid }: { isValid?: boolean }) => (
    <ButtonBuy
      action="download"
      disabled={isDisabled || !isValid}
      hasPreviousOrder={isOwned}
      hasDatatoken={hasDatatoken}
      btSymbol={accessDetails?.baseToken?.symbol}
      dtSymbol={asset?.indexedMetadata?.stats[0]?.symbol}
      dtBalance={dtBalance}
      type="submit"
      assetTimeout={secondsToString(asset?.services?.[0]?.timeout)}
      assetType={asset?.metadata?.type}
      stepText={statusText}
      isLoading={isLoading}
      priceType={accessDetails?.type}
      isConsumable={accessDetails?.isPurchasable}
      isBalanceSufficient={isBalanceSufficient}
      consumableFeedback={undefined}
      retry={retry}
      isSupportedOceanNetwork={isSupportedOceanNetwork}
      isAccountConnected={isConnected}
    />
  )

  const AssetAction = ({ asset }: { asset: AssetExtended }) => {
    const { isValid } = useFormikContext()
    const isPricingLoaded =
      accessDetails?.type === 'free' || (!isPriceLoading && orderPriceAndFees)

    return (
      <div>
        {isOrderDisabled ? (
          <Alert
            className={styles.fieldWarning}
            state="info"
            text={`The publisher temporarily disabled ordering for this asset`}
          />
        ) : !isPricingLoaded ? (
          <Loader message="Loading pricing data..." />
        ) : isUnsupportedPricing ? (
          <Alert
            className={styles.fieldWarning}
            state="info"
            text={`No pricing schema available for this asset.`}
          />
        ) : (
          <>
            <ConsumerParameters asset={asset} />
            {!isInPurgatory && (
              <div className={styles.buttonBuy}>
                <PurchaseButton isValid={isValid} />
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <Formik
      initialValues={{
        dataServiceParams: getDefaultValues(
          asset?.services[0].consumerParameters
        )
      }}
      validationSchema={getDownloadValidationSchema(
        asset?.services[0].consumerParameters
      )}
      onSubmit={async (values) => {
        const dataServiceParams = parseConsumerParameterValues(
          values?.dataServiceParams,
          asset.services[0].consumerParameters
        )
        await handleOrderOrDownload(dataServiceParams)
      }}
    >
      <Form>
        <aside className={styles.consume}>
          <div className={styles.info}>
            <div className={styles.filewrapper}>
              <FileIcon file={file} isLoading={fileIsLoading} small />
            </div>
            {isPriceLoading ? (
              <Loader message="Calculating full price (including fees)" />
            ) : (
              <Price
                className={styles.price}
                price={assetPrice}
                orderPriceAndFees={orderPriceAndFees}
                conversion
                size="large"
              />
            )}
          </div>
          <AssetAction asset={asset} />
        </aside>
      </Form>
    </Formik>
  )
})
