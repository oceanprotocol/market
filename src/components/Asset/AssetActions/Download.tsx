import React, { ReactElement, useEffect, useState } from 'react'
import FileIcon from '@shared/FileIcon'
import Price from '@shared/Price'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ButtonBuy from '@shared/ButtonBuy'
import { secondsToString } from '@utils/ddo'
import AlgorithmDatasetsListForCompute from './Compute/AlgorithmDatasetsListForCompute'
import styles from './Download.module.css'
import {
  FileMetadata,
  LoggerInstance,
  ZERO_ADDRESS,
  FixedRateExchange
} from '@oceanprotocol/lib'
import { order } from '@utils/order'
import { AssetExtended } from 'src/@types/AssetExtended'
import { buyDtFromPool } from '@utils/pool'
import { downloadFile } from '@utils/provider'
import { getCollectTokensFeedback, getOrderFeedback } from '@utils/feedback'
import { getOrderPriceAndFees } from '@utils/accessDetailsAndPricing'
import { OrderPriceAndFees } from 'src/@types/Price'
import { toast } from 'react-toastify'
import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from '@utils/subgraph'
import { getOceanConfig } from '@utils/ocean'
import { FixedRateExchanges } from 'src/@types/subgraph/FixedRateExchanges'

const FixedRateExchangesQuery = gql`
  query FixedRateExchanges($user: String, $exchangeId: String) {
    fixedRateExchanges(where: { owner: $user, exchangeId: $exchangeId }) {
      id
      owner {
        id
      }
      exchangeId
      baseTokenBalance
    }
  }
`
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
  const [isCollectLoading, setIsCollectLoading] = useState(false)
  const [baseTokenBalance, setBaseTokenBalance] = useState(0)
  const [collectStatusText, setCollectStatusText] = useState('')
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

      setIsLoading(false)
    }

    init()
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

  useEffect(() => {
    if (!accountId || asset.nft.owner !== accountId) return
    const queryContext = getQueryContext(Number(asset.chainId))

    async function getBaseTokenBalance() {
      const variables = {
        user: accountId.toLowerCase(),
        exchangeId: asset?.accessDetails?.addressOrId
      }
      const result: OperationResult<FixedRateExchanges> = await fetchData(
        FixedRateExchangesQuery,
        variables,
        queryContext
      )
      result?.data?.fixedRateExchanges[0]?.baseTokenBalance
        ? setBaseTokenBalance(
            parseInt(result?.data?.fixedRateExchanges[0]?.baseTokenBalance)
          )
        : setBaseTokenBalance(0)
    }
    getBaseTokenBalance()
  }, [accountId, asset?.accessDetails?.addressOrId, asset.chainId, asset.nft])

  async function handleOrderOrDownload() {
    setIsLoading(true)
    if (isOwned) {
      setStatusText(
        getOrderFeedback(
          asset.accessDetails?.baseToken?.symbol,
          asset.accessDetails?.datatoken?.symbol
        )[3]
      )
      await downloadFile(web3, asset, accountId, validOrderTx)
    } else {
      try {
        if (!hasDatatoken && asset.accessDetails.type === 'dynamic') {
          setStatusText(
            getOrderFeedback(
              asset.accessDetails.baseToken?.symbol,
              asset.accessDetails.datatoken?.symbol
            )[0]
          )

          const tx = await buyDtFromPool(asset.accessDetails, accountId, web3)

          if (!tx) {
            toast.error('Failed to buy datatoken from pool!')
            setIsLoading(false)
            return
          }
        }
        setStatusText(
          getOrderFeedback(
            asset.accessDetails.baseToken?.symbol,
            asset.accessDetails.datatoken?.symbol
          )[asset.accessDetails?.type === 'fixed' ? 2 : 1]
        )
        const orderTx = await order(web3, asset, orderPriceAndFees, accountId)

        setIsOwned(true)
        setValidOrderTx(orderTx.transactionHash)
      } catch (ex) {
        LoggerInstance.log(ex.message)
        setIsLoading(false)
      }
    }

    setIsLoading(false)
  }

  async function handleCollectTokens() {
    setIsCollectLoading(true)
    const config = getOceanConfig(asset?.chainId)
    const fixed = new FixedRateExchange(web3, config.fixedRateExchangeAddress)
    try {
      setCollectStatusText(
        getCollectTokensFeedback(
          asset.accessDetails.baseToken?.symbol,
          baseTokenBalance.toString()
        )
      )

      const tx = await fixed.collectBT(
        accountId,
        asset?.accessDetails?.addressOrId
      )

      if (!tx) {
        setIsCollectLoading(false)
        return
      }
      setBaseTokenBalance(0)
      return tx
    } catch (error) {
      LoggerInstance.log(error.message)
      setIsCollectLoading(false)
    } finally {
      setIsCollectLoading(false)
    }
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

  const CollectTokensButton = () => (
    <ButtonBuy
      action="collect"
      onClick={handleCollectTokens}
      disabled={baseTokenBalance === 0 || !baseTokenBalance}
      hasPreviousOrder={false}
      hasDatatoken={false}
      dtSymbol={asset?.accessDetails?.baseToken.symbol}
      dtBalance={baseTokenBalance.toString()}
      datasetLowPoolLiquidity={false}
      assetType=""
      stepText={collectStatusText}
      assetTimeout=""
      isConsumable={false}
      consumableFeedback=""
      isBalanceSufficient={false}
      isLoading={isCollectLoading}
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
      <div className={styles.collect}>
        {asset.nft.owner === accountId && <CollectTokensButton />}
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
