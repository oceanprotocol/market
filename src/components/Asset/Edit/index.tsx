import React, { ReactElement, useState } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import styles from './index.module.css'
import Tabs from '@shared/atoms/Tabs'
import EditMetadata from './EditMetadata'
import EditComputeDataset from './EditComputeDataset'

export default function Edit({}): ReactElement {
  const { accountId } = useWeb3()
  const { asset } = useAsset()
  LoggerInstance.log('asset edit main = ', asset)
  LoggerInstance.log('accountId = ', accountId)

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    const type = tabName.toLowerCase()
  }

  const tabs = [
    {
      title: 'Edit Metadata',
      content: <EditMetadata asset={asset}></EditMetadata>
    },
    {
      title: 'Edit Compute Settings',
      content: <EditComputeDataset asset={asset}></EditComputeDataset>
    }
  ].filter((tab) => tab !== undefined)

  return (
    <Tabs
      items={tabs}
      handleTabChange={handleTabChange}
      defaultIndex={0}
      className={styles.edit}
    />
  )
}
