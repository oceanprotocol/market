import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { MetadataMarket } from '../../../@types/Metadata'
import { DDO } from '@oceanprotocol/lib'
import Tabs from '../../atoms/Tabs'

export default function AssetActions({
  metadata,
  ddo
}: {
  metadata: MetadataMarket
  ddo: DDO
}): ReactElement {
  const { access } = metadata.additionalInformation
  const isCompute = access && access === 'Compute'
  const UseContent = isCompute ? (
    <Compute ddo={ddo} />
  ) : (
    <Consume ddo={ddo} file={metadata.main.files[0]} />
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
