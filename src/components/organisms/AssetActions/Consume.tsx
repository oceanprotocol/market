import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { File as FileMetadata, DDO } from '@oceanprotocol/lib'
import Button from '../../atoms/Button'
import File from '../../atoms/File'
import Price from '../../atoms/Price'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import styles from './Consume.module.css'
import Loader from '../../atoms/Loader'
import { useOcean, useConsume, usePricing } from '@oceanprotocol/react'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import checkPreviousOrder from '../../../utils/checkPreviousOrder'
import { useAsset } from '../../../providers/Asset'
import { secondsToString } from '../../../utils/metadata'
import { gql, useQuery } from '@apollo/client'
import { OrdersData } from '../../../@types/apollo/OrdersData'
import BigNumber from 'bignumber.js'

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

function getHelpText(
  token: {
    dtBalance: string
    dtSymbol: string
  },
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  timeout: string
) {
  const { dtBalance, dtSymbol } = token
  const assetTimeout = timeout === 'Forever' ? '' : ` for ${timeout}`
  const text = hasPreviousOrder
    ? `You bought this data set already allowing you to download it without paying again${assetTimeout}.`
    : hasDatatoken
    ? `You own ${dtBalance} ${dtSymbol} allowing you to use this data set by spending 1 ${dtSymbol}, but without paying OCEAN again.`
    : `For using this data set, you will buy 1 ${dtSymbol} and immediately spend it back to the publisher and pool.`

  return text
}

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
  const { ocean, accountId } = useOcean()
  const { marketFeeAddress } = useSiteMetadata()
  const [hasPreviousOrder, setHasPreviousOrder] = useState(false)
  const [previousOrderId, setPreviousOrderId] = useState<string>()
  const { isInPurgatory, price, type } = useAsset()
  const { buyDT, pricingStepText, pricingError, pricingIsLoading } = usePricing(
    ddo
  )
  const { consumeStepText, consume, consumeError } = useConsume()
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [isConsumable, setIsConsumable] = useState(true)
  const [assetTimeout, setAssetTimeout] = useState('')

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
    !hasPreviousOrder && !hasDatatoken && (await buyDT('1'))
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
    <div className={styles.actions}>
      {consumeStepText || pricingIsLoading ? (
        <Loader message={consumeStepText || pricingStepText} />
      ) : (
        <>
          <Button style="primary" onClick={handleConsume} disabled={isDisabled}>
            {hasPreviousOrder
              ? 'Download'
              : `Buy ${
                  assetTimeout === 'Forever' ? '' : ` for ${assetTimeout}`
                }`}
          </Button>
          <div className={styles.help}>
            {getHelpText(
              { dtBalance, dtSymbol: ddo.dataTokenInfo.symbol },
              hasDatatoken,
              hasPreviousOrder,
              assetTimeout
            )}
          </div>
        </>
      )}
    </div>
  )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} />
        </div>
        <div className={styles.pricewrapper}>
          <Price ddo={ddo} conversion />
          {!isInPurgatory && <PurchaseButton />}
        </div>
      </div>
      <footer className={styles.feedback}>
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </aside>
  )
}
