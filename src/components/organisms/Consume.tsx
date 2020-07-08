import React, { ReactElement } from 'react'
import Web3 from 'web3'
import compareAsBN, { Comparisson } from '../../utils/compareAsBN'
import Button from '../atoms/Button'
import File from '../atoms/File'
import Price from '../atoms/Price'
import Web3Feedback from '../molecules/Wallet/Feedback'
import styles from './Consume.module.css'
import Loader from '../atoms/Loader'
import { useOcean, useConsume } from '@oceanprotocol/react'
import { MetaDataMarket } from '../../@types/MetaData'

export default function Consume({
  did,
  metadata
}: {
  did: string
  metadata: MetaDataMarket
}): ReactElement {
  const { ocean, balanceInOcean } = useOcean()
  const { consume, consumeStepText, isLoading } = useConsume()
  const { price } = metadata.main
  const file = metadata.main.files[0]
  const isFree = price === '0'
  const isBalanceSufficient =
    isFree ||
    compareAsBN(balanceInOcean, Web3.utils.fromWei(price), Comparisson.gte)
  const isDisabled = !ocean || !isBalanceSufficient || isLoading

  const PurchaseButton = () => {
    if (typeof window === 'undefined') {
      return null
    }

    return isLoading ? (
      <Loader message={consumeStepText} isHorizontal />
    ) : (
      <Button
        style="primary"
        onClick={() => consume(did)}
        disabled={isDisabled}
      >
        {isFree ? 'Download' : 'Buy'}
      </Button>
    )
  }

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} />
        </div>
        <div className={styles.pricewrapper}>
          <Price price={price} className={styles.price} />
          <PurchaseButton />
        </div>
      </div>

      <footer className={styles.feedback}>
        <Web3Feedback isBalanceInsufficient={!isBalanceSufficient} />
      </footer>
    </aside>
  )
}
