import React, { ReactElement, useState, useEffect } from 'react'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { DDO } from '@oceanprotocol/lib'
import Tabs from '../../atoms/Tabs'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import compareAsBN from '../../../utils/compareAsBN'
import Pool from './Pool'

export default function AssetActions({ ddo }: { ddo: DDO }): ReactElement {
  const { balance } = useOcean()
  const { price } = useMetadata(ddo)
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>()

  const isCompute = Boolean(ddo.findServiceByType('compute'))
  const { attributes } = ddo.findServiceByType('metadata')
  const { priceType } = attributes.additionalInformation

  // Check user balance against price
  useEffect(() => {
    if (!price || !balance || !balance.ocean) return

    const isFree = price === '0'
    setIsBalanceSufficient(isFree ? true : compareAsBN(balance.ocean, price))

    return () => {
      setIsBalanceSufficient(false)
    }
  }, [balance, price])

  const UseContent = isCompute ? (
    <Compute ddo={ddo} isBalanceSufficient={isBalanceSufficient} />
  ) : (
    <Consume
      ddo={ddo}
      isBalanceSufficient={isBalanceSufficient}
      file={attributes.main.files[0]}
    />
  )

  const tabs = [
    {
      title: 'Use',
      content: UseContent
    },
    (!priceType || priceType === 'advanced') && {
      title: 'Pool',
      content: <Pool ddo={ddo} />
    }
  ]

  return <Tabs items={tabs} className={styles.actions} />
}
