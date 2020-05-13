import React from 'react'
import { DDO } from '@oceanprotocol/squid'
import Web3 from 'web3'
import { findServiceByType } from '../../utils'
import compareAsBN, { Comparisson } from '../../utils/compareAsBN'
import Button from '../atoms/Button'
import File from '../atoms/File'
import Price from '../atoms/Price'
import { MetaDataDexFreight } from '../../@types/MetaData'
import Web3Feedback from '../molecules/Web3Feedback'
import styles from './Consume.module.css'
import Loader from '../atoms/Loader'
import { useWeb3, useOcean, useConsume } from '@oceanprotocol/react'

export default function Consume({ ddo }: { ddo: DDO | undefined }) {
  if (!ddo) return null

  const { web3 } = useWeb3()
  const { ocean, balanceInOcean } = useOcean()
  const { consume, consumeStepText, isLoading } = useConsume()
  const { attributes } = findServiceByType(ddo, 'metadata')
  const { price } = attributes.main
  const file = (attributes as MetaDataDexFreight).main.files[0]
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
      <Button primary onClick={() => consume(ddo.id)} disabled={isDisabled}>
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
