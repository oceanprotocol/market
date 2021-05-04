import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { File as FileMetadata, DDO } from '@oceanprotocol/lib'
import File from '../../atoms/File'
import Price from '../../atoms/Price'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import styles from './Consume.module.css'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { useAsset } from '../../../providers/Asset'
import { secondsToString } from '../../../utils/metadata'
import { gql, useQuery } from '@apollo/client'
import { OrdersData } from '../../../@types/apollo/OrdersData'
import BigNumber from 'bignumber.js'
import { useOcean } from '../../../providers/Ocean'
import { useWeb3 } from '../../../providers/Web3'
import { usePricing } from '../../../hooks/usePricing'
import { useConsume } from '../../../hooks/useConsume'
import ButtonBuy from '../../atoms/ButtonBuy'
import axios from 'axios'
import AssetSelection from '../../molecules/FormFields/AssetSelection'
import {
  queryMetadata,
  transformDDOToAssetSelection
} from '../../../utils/aquarius'

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
  dtBalance
}: {
  ddo: DDO
  file: FileMetadata
  isBalanceSufficient: boolean
  dtBalance: string
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean, config } = useOcean()
  const { marketFeeAddress } = useSiteMetadata()
  const [hasPreviousOrder, setHasPreviousOrder] = useState(false)
  const [previousOrderId, setPreviousOrderId] = useState<string>()
  const { isInPurgatory, price, type } = useAsset()
  const {
    buyDT,
    pricingStepText,
    pricingError,
    pricingIsLoading
  } = usePricing()
  const { consumeStepText, consume, consumeError } = useConsume()
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [isConsumable, setIsConsumable] = useState(true)
  const [assetTimeout, setAssetTimeout] = useState('')
  const [datasetsForCompute, setDatasetsForCompute] = useState()
  const query = {
    offset: 9,
    query: {
      query_string: {
        query: `service.attributes.main.type:dataset AND service.type:compute AND service.attributes.main.privacy.publisherTrustedAlgorithms.did:${ddo.id}`
      }
    },
    sort: { created: -1 }
  }

  useEffect(() => {
    async function get() {
      const source = axios.CancelToken.source()
      const gueryResults = await queryMetadata(
        query,
        config.metadataCacheUri,
        source.token
      )
      const datasets = await transformDDOToAssetSelection(
        gueryResults.results,
        config.metadataCacheUri,
        []
      )
      setDatasetsForCompute(datasets)
    }
    get()
  }, [])

  const { data } = useQuery<OrdersData>(previousOrderQuery, {
    variables: {
      id: ddo.dataToken?.toLowerCase(),
      account: accountId?.toLowerCase()
    },
    pollInterval: 5000
  })

  useEffect(() => {
    if (!data || !assetTimeout || data.tokenOrders.length === 0) return

    const lastOrder = data.tokenOrders[0]

    if (assetTimeout === 'Forever') {
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
  }, [data, assetTimeout])

  useEffect(() => {
    const { timeout } = ddo.findServiceByType('access').attributes.main
    setAssetTimeout(secondsToString(timeout))
  }, [ddo])

  useEffect(() => {
    if (!price) return

    setIsConsumable(
      price.isConsumable !== undefined ? price.isConsumable === 'true' : true
    )
  }, [price])

  useEffect(() => {
    setHasDatatoken(Number(dtBalance) >= 1)
  }, [dtBalance])

  useEffect(() => {
    setIsDisabled(
      (!ocean ||
        !isBalanceSufficient ||
        typeof consumeStepText !== 'undefined' ||
        pricingIsLoading ||
        !isConsumable) &&
        !hasPreviousOrder &&
        !hasDatatoken
    )
  }, [
    ocean,
    hasPreviousOrder,
    isBalanceSufficient,
    consumeStepText,
    pricingIsLoading,
    isConsumable,
    hasDatatoken
  ])

  async function handleConsume() {
    !hasPreviousOrder && !hasDatatoken && (await buyDT('1', price, ddo))
    await consume(
      ddo.id,
      ddo.dataToken,
      'access',
      marketFeeAddress,
      previousOrderId
    )
    setHasPreviousOrder(true)
  }

  // Output errors in UI
  useEffect(() => {
    consumeError && toast.error(consumeError)
    pricingError && toast.error(pricingError)
  }, [consumeError, pricingError])

  const PurchaseButton = () => (
    <ButtonBuy
      action="download"
      disabled={isDisabled}
      hasPreviousOrder={hasPreviousOrder}
      hasDatatoken={hasDatatoken}
      dtSymbol={ddo.dataTokenInfo?.symbol}
      dtBalance={dtBalance}
      onClick={handleConsume}
      assetTimeout={assetTimeout}
      assetType={type}
      stepText={consumeStepText || pricingStepText}
      isLoading={pricingIsLoading}
    />
  )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} />
        </div>
        <div className={styles.pricewrapper}>
          <Price price={price} conversion />
          {!isInPurgatory && <PurchaseButton />}
        </div>
      </div>
      {type === 'algorithm' && (
        <div className={styles.datasetsContainer}>
          <span className={styles.text}>
            Datasets algorithm is allowed to run on
          </span>
          <AssetSelection assets={datasetsForCompute} hideRadio />
        </div>
      )}
      <footer className={styles.feedback}>
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </aside>
  )
}
