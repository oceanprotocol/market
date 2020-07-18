import React, { ReactElement } from 'react'
import { fromWei } from 'web3-utils'
import { toast } from 'react-toastify'
import compareAsBN, { Comparisson } from '../../../utils/compareAsBN'
import Button from '../../atoms/Button'
import File from '../../atoms/File'
import Price from '../../atoms/Price'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import styles from './Consume.module.css'
import Loader from '../../atoms/Loader'
import { useOcean, useConsume, useMetadata } from '@oceanprotocol/react'
import { MetadataMarket } from '../../../@types/Metadata'

export default function Consume({
  did,
  metadata
}: {
  did: string
  metadata: MetadataMarket
}): ReactElement {
  const { ddo } = useMetadata(did)
  const file = metadata.main.files[0]
  const { cost } = ddo.findServiceByType('access').attributes.main

  const { ocean } = useOcean()
  const { consumeStepText, consume, consumeError } = useConsume()

  const isFree = cost === '0'
  // const isBalanceSufficient =
  //  isFree || compareAsBN(balanceInOcean, fromWei(cost), Comparisson.gte)
  const isDisabled = !ocean

  if (consumeError) {
    toast.error(consumeError)
  }

  const PurchaseButton = () =>
    consumeStepText ? (
      <Loader message={consumeStepText} />
    ) : (
      <Button
        style="primary"
        onClick={() => consume(did, ddo.dataToken, 'access')}
        disabled={isDisabled}
      >
        {isFree ? 'Download' : 'Buy'}
      </Button>
    )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} />
        </div>
        <div className={styles.pricewrapper}>
          <Price price={cost} className={styles.price} />
          <PurchaseButton />
        </div>
      </div>

      <footer className={styles.feedback}>
        <Web3Feedback isBalanceInsufficient />
      </footer>
    </aside>
  )
}
