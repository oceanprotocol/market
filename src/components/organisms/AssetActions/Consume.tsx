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
import { mapSecondsToTimeoutString } from '../../../utils/metadata'

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
  const { isInPurgatory, price } = useAsset()
  const { buyDT, pricingStepText, pricingError, pricingIsLoading } = usePricing(
    ddo
  )
  const { consumeStepText, consume, consumeError } = useConsume()
  const [isDisabled, setIsDisabled] = useState(true)
  const [hasDatatoken, setHasDatatoken] = useState(false)
  const [isConsumable, setIsConsumable] = useState(true)
  const [assetTimeout, setAssetTimeout] = useState('')

  useEffect(() => {
    const { timeout } = ddo.findServiceByType('access').attributes.main
    setAssetTimeout(mapSecondsToTimeoutString(timeout))
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

  useEffect(() => {
    if (!ocean || !accountId) return

    async function checkOrders() {
      const orderId = await checkPreviousOrder(ocean, accountId, ddo, 'access')
      setPreviousOrderId(orderId)
      setHasPreviousOrder(!!orderId)
    }
    checkOrders()
  }, [ocean, ddo, accountId])

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
            {hasPreviousOrder ? 'Download' : 'Buy'}
            {assetTimeout === 'Forever' ? '' : ` for ${assetTimeout}`}
          </Button>
          {hasDatatoken && (
            <div className={styles.help}>
              You own {dtBalance} {ddo.dataTokenInfo.symbol} allowing you to use
              this data set without paying OCEAN again.
            </div>
          )}
          {(!hasDatatoken || !hasPreviousOrder) && (
            <div className={styles.help}>
              For using this data set, you will buy 1 {ddo.dataTokenInfo.symbol}{' '}
              and immediately spend it back to the publisher and pool.
            </div>
          )}
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
          {isConsumable ? (
            <Price ddo={ddo} conversion />
          ) : (
            <div className={styles.help}>
              There is not enough liquidity in the pool to buy this data set.
            </div>
          )}
          {!isInPurgatory && <PurchaseButton />}
        </div>
      </div>

      <footer className={styles.feedback}>
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </aside>
  )
}
