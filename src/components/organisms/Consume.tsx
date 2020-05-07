import React from 'react'
import { DDO } from '@oceanprotocol/squid'
import Web3 from 'web3'
import { findServiceByType } from '../../utils'
import compareAsBN, { Comparisson } from '../../utils/compareAsBN'
import Button from '../atoms/Button'
import File from '../atoms/File'
import Price from '../atoms/Price'
import usePurchase from '../../hooks/usePurchase'
import { MetaDataDexFreight } from '../../@types/MetaData'
import Web3Feedback from '../molecules/Web3Feedback'
import useOcean from '../../hooks/useOcean'
import useWeb3 from '../../hooks/useWeb3'
import styles from './Consume.module.css'
import Loader from '../atoms/Loader'

export const feedback: { [key in number]: string } = {
  99: 'Decrypting file URL...',
  0: '1/3 Asking for agreement signature...',
  1: '1/3 Agreement initialized.',
  2: '2/3 Asking for two payment confirmations...',
  3: '2/3 Payment confirmed. Requesting access...',
  4: '3/3 Access granted. Consuming file...'
}

export default function Consume({ ddo }: { ddo: DDO | undefined }) {
  if (!ddo) return null

  const { web3 } = useWeb3()
  const { ocean, balance } = useOcean(web3)
  const { purchaseAsset, isLoading, feedbackStep } = usePurchase()
  const { attributes } = findServiceByType(ddo, 'metadata')
  const { price } = attributes.main
  const file = (attributes as MetaDataDexFreight).main.files[0]
  const isFree = price === '0'
  const isBalanceSufficient =
    isFree || compareAsBN(balance, Web3.utils.fromWei(price), Comparisson.gte)
  const isDisabled = !ocean || !isBalanceSufficient || isLoading

  const PurchaseButton = () => {
    if (typeof window === 'undefined') {
      return null
    }

    return isLoading ? (
      <Loader message={feedback[feedbackStep]} isHorizontal />
    ) : (
      <Button
        primary
        onClick={() => purchaseAsset(new DDO(ddo))}
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
