import React, { ReactElement, useEffect } from 'react'
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
  const { ocean } = useOcean()
  const { marketFeeAddress } = useSiteMetadata()
  const { buyDT, pricingStepText, pricingError } = usePricing()
  const { consumeStepText, consume, consumeError } = useConsume()

  const isDisabled =
    !ocean || !isBalanceSufficient || consumeStepText || pricingStepText
  const hasDatatoken = Number(dtBalance) >= 1

  async function handleConsume() {
    !hasDatatoken && (await buyDT(ddo.dataToken, '1'))
    await consume(ddo.id, ddo.dataToken, 'access', marketFeeAddress)
  }

  // Output errors in UI
  useEffect(() => {
    consumeError && toast.error(consumeError)
    pricingError && toast.error(pricingError)
  }, [consumeError, pricingError])

  const PurchaseButton = () => (
    <div>
      {consumeStepText || pricingStepText ? (
        <Loader message={consumeStepText || pricingStepText} />
      ) : (
        <Button style="primary" onClick={handleConsume} disabled={isDisabled}>
          {hasDatatoken ? 'Download' : 'Buy'}
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
              You own {dtBalance} {ddo.dataTokenInfo?.symbol || 'DT'} so you can
              use this asset without paying again.
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
