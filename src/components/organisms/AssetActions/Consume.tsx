import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { File as FileMetadata, DDO } from '@oceanprotocol/lib'
import File from '../../atoms/File'
import Price from '../../atoms/Price'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { useAsset } from '../../../providers/Asset'
import { gql } from 'urql'
import { fetchData, getQueryContext } from '../../../utils/subgraph'
import { OrdersData } from '../../../@types/apollo/OrdersData'
import BigNumber from 'bignumber.js'
import { useOcean } from '../../../providers/Ocean'
import { useWeb3 } from '../../../providers/Web3'
import { usePricing } from '../../../hooks/usePricing'
import { useConsume } from '../../../hooks/useConsume'
import ButtonBuy from '../../atoms/ButtonBuy'
import { secondsToString } from '../../../utils/metadata'
import AlgorithmDatasetsListForCompute from '../AssetContent/AlgorithmDatasetsListForCompute'
import styles from './Consume.module.css'
import { useIsMounted } from '../../../hooks/useIsMounted'

const previousOrderQuery = gql`
  query PreviousOrder($id: String!, $account: String!) {
    tokenOrders(
      first: 1
      where: { datatokenId: $id, payer: $account }
      orderBy: timestamp
      orderDirection: desc
    ) {
      timestamp
      tx
    }
  }
`

export default function Consume({
  ddo,
  file,
  isBalanceSufficient,
  dtBalance,
  fileIsLoading,
  isConsumable,
  consumableFeedback
}: {
  ddo: DDO
  file: FileMetadata
  isBalanceSufficient: boolean
  dtBalance: string
  fileIsLoading?: boolean
  isConsumable?: boolean
  consumableFeedback?: string
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const { appConfig } = useSiteMetadata()
  const [hasPreviousOrder, setHasPreviousOrder] = useState(false)
  const [previousOrderId, setPreviousOrderId] = useState<string>()
  const { isInPurgatory, price, type, isAssetNetwork } = useAsset()
  const { buyDT, pricingStepText, pricingError, pricingIsLoading } =
    usePricing()
  const { consumeStepText, consume, consumeError, isLoading } = useConsume()
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [isConsumablePrice, setIsConsumablePrice] = useState(true)
  const [assetTimeout, setAssetTimeout] = useState('')
  const [data, setData] = useState<OrdersData>()
  const isMounted = useIsMounted()

  useEffect(() => {
    if (!ddo || !accountId) return
    const context = getQueryContext(ddo.chainId)
    const variables = {
      id: ddo.dataToken?.toLowerCase(),
      account: accountId?.toLowerCase()
    }
    fetchData(previousOrderQuery, variables, context).then((result: any) => {
      isMounted() && setData(result.data)
    })
  }, [ddo, accountId, hasPreviousOrder, isMounted])

  useEffect(() => {
    if (
      !data ||
      !assetTimeout ||
      data.tokenOrders.length === 0 ||
      !accountId ||
      !isAssetNetwork
    )
      return

    const lastOrder = data.tokenOrders[0]
    if (assetTimeout === '0') {
      setPreviousOrderId(lastOrder.tx)
      setHasPreviousOrder(true)
    } else {
      const expiry = new BigNumber(lastOrder.timestamp).plus(assetTimeout)
      const unixTime = new BigNumber(Math.floor(Date.now() / 1000))
      if (unixTime.isLessThan(expiry)) {
        setPreviousOrderId(lastOrder.tx)
        setHasPreviousOrder(true)
      } else {
        setHasPreviousOrder(false)
      }
    }
  }, [data, assetTimeout, accountId, isAssetNetwork])

  useEffect(() => {
    const { timeout } = ddo.findServiceByType('access').attributes.main
    setAssetTimeout(`${timeout}`)
  }, [ddo])

  useEffect(() => {
    if (!price) return

    setIsConsumablePrice(
      price.isConsumable !== undefined ? price.isConsumable === 'true' : true
    )
  }, [price])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    if (!accountId) return
    setIsDisabled(
      !isConsumable ||
        ((!ocean ||
          !isBalanceSufficient ||
          !isAssetNetwork ||
          typeof consumeStepText !== 'undefined' ||
          pricingIsLoading ||
          (!hasPreviousOrder && !hasDatatoken) ||
          !isConsumablePrice) &&
          !hasPreviousOrder &&
          !hasDatatoken)
    )
  }, [
    ocean,
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
    if (!hasPreviousOrder && !hasDatatoken) {
      const tx = await buyDT('1', price, ddo)
      if (tx === undefined) return
    }
    const error = await consume(
      ddo.id,
      ddo.dataToken,
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
      dtSymbol={ddo.dataTokenInfo?.symbol}
      dtBalance={dtBalance}
      datasetLowPoolLiquidity={!isConsumablePrice}
      onClick={handleConsume}
      assetTimeout={secondsToString(parseInt(assetTimeout))}
      assetType={type}
      stepText={consumeStepText || pricingStepText}
      isLoading={pricingIsLoading || isLoading}
      priceType={price?.type}
      isConsumable={isConsumable}
      isBalanceSufficient={isBalanceSufficient}
      consumableFeedback={consumableFeedback}
    />
  )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} isLoading={fileIsLoading} />
        </div>
        <div className={styles.pricewrapper}>
          <Price price={price} conversion />
          {!isInPurgatory && <PurchaseButton />}
        </div>
      </div>
      {type === 'algorithm' && (
        <AlgorithmDatasetsListForCompute algorithmDid={ddo.id} dataset={ddo} />
      )}
    </aside>
  )
}
