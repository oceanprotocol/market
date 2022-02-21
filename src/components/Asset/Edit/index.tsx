import React, { ReactElement, useState, useEffect } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import styles from './index.module.css'
import Tabs from '@shared/atoms/Tabs'
import EditMetadata from './EditMetadata'
import EditComputeDataset from './EditComputeDataset'
import Page from '@shared/Page'
import Loader from '@shared/atoms/Loader'

export default function Edit({ uri }: { uri: string }): ReactElement {
  const { asset, error, loading } = useAsset()
  const [isCompute, setIsCompute] = useState(false)

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    LoggerInstance.log('switched to tab', tabName)
    // add store restore from
  }

  useEffect(() => {
    if (!asset || error) return
    const isCompute = asset?.services[0]?.type === 'compute' ? true : false
    setIsCompute(isCompute)
  }, [asset])

  const tabs = [
    {
      title: 'Edit Metadata',
      content: <EditMetadata asset={asset}></EditMetadata>
    },
    {
      title: 'Edit Compute Settings',
      content: <EditComputeDataset asset={asset}></EditComputeDataset>,
      disabled: !isCompute
    }
  ].filter((tab) => tab !== undefined)

  return asset && !loading ? (
    <Page uri={uri}>
      <div className={styles.contianer}>
        <Tabs
          items={tabs}
          handleTabChange={handleTabChange}
          defaultIndex={0}
          className={styles.edit}
        />
      </div>
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
