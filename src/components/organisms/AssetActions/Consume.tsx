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

  const {
    dtSymbol,
    buyDT,
    pricingStepText,
    pricingError,
    pricingIsLoading
  } = usePricing(ddo)
  const { consumeStepText, consume, consumeError } = useConsume()
  const isDisabled =
    !ocean ||
    !isBalanceSufficient ||
    typeof consumeStepText !== 'undefined' ||
    pricingIsLoading
  const hasDatatoken = Number(dtBalance) >= 1

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
        <Button style="primary" onClick={handleConsume} disabled={isDisabled}>
          {hasDatatoken || hasPreviousOrder ? 'Download' : 'Buy'}
        </Button>
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
          {hasDatatoken && (
            <div className={styles.hasTokens}>
              You own {dtBalance} {dtSymbol} allowing you to use this data set
              without paying again.
            </div>
          )}
          <PurchaseButton />
        </div>
      </div>

      <footer className={styles.feedback}>
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </aside>
  )
}
