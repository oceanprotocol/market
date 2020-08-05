import React, { ReactElement, useState, useEffect } from 'react'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { MetadataMarket } from '../../../@types/Metadata'
import { DDO } from '@oceanprotocol/lib'
import Tabs from '../../atoms/Tabs'
import { useMetadata } from '@oceanprotocol/react'

export default function AssetActions({
  metadata,
  ddo
}: {
  metadata: MetadataMarket
  ddo: DDO
}): ReactElement {
  const { getBestPrice } = useMetadata(ddo.id)
  const [price, setPrice] = useState<string>()

  useEffect(() => {
    async function init() {
      const price = await getBestPrice(ddo.dataToken)
      price && setPrice(price)
    }
    init()
  }, [])

  const isCompute = Boolean(ddo.findServiceByType('compute'))
  const UseContent = isCompute ? (
    <Compute ddo={ddo} price={price} />
  ) : (
    <Consume ddo={ddo} price={price} file={metadata.main.files[0]} />
  )

  const tabs = [
    {
      title: 'Use',
      content: UseContent
    },
    {
      title: 'Trade',
      content: 'Trade Me'
    }
  ]

  return <Tabs items={tabs} className={styles.actions} />
}
