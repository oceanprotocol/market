import React, { ReactElement, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { File as FileMetadata, DDO } from '@oceanprotocol/lib'
import Button from '../../atoms/Button'
import File from '../../atoms/File'
import Price from '../../atoms/Price'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import styles from './Consume.module.css'
import Loader from '../../atoms/Loader'
import { useOcean, useConsume } from '@oceanprotocol/react'
import compareAsBN, { Comparison } from '../../../utils/compareAsBN'

export default function Consume({
  ddo,
  file
}: {
  ddo: DDO
  file: FileMetadata
}): ReactElement {
  const { ocean, balance } = useOcean()
  const { consumeStepText, consume, consumeError } = useConsume()
  const [price, setPrice] = useState<string>()
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false)

  const isFree = price === '0'
  const isDisabled = !ocean || !isBalanceSufficient

  useEffect(() => {
    if (!price || !balance || !balance.ocean) return

    setIsBalanceSufficient(compareAsBN(balance.ocean, price, Comparison.gte))

    return () => {
      setIsBalanceSufficient(false)
    }
  }, [balance, price])

  if (consumeError) {
    toast.error(consumeError)
  }

  const PurchaseButton = () =>
    consumeStepText ? (
      <Loader message={consumeStepText} />
    ) : (
      <Button
        style="primary"
        onClick={() => consume(ddo.id, ddo.dataToken, 'access')}
        disabled={isDisabled}
      >
        Buy
      </Button>
    )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} />
        </div>
        <div className={styles.pricewrapper}>
          <Price ddo={ddo} setPriceOutside={setPrice} />
          <PurchaseButton />
        </div>
      </div>

      <footer className={styles.feedback}>
        <Web3Feedback isBalanceInsufficient />
      </footer>
    </aside>
  )
}
