import React, { ReactElement, useState, useEffect } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import styles from './index.module.css'
import Tabs from '@shared/atoms/Tabs'
import EditMetadata from './EditMetadata'
import EditComputeDataset from './EditComputeDataset'
import Page from '@shared/Page'
import Loader from '@shared/atoms/Loader'
import { useWeb3 } from '@context/Web3'
import Alert from '@shared/atoms/Alert'

export default function Edit({ uri }: { uri: string }): ReactElement {
  const { asset, error, title, isInPurgatory, loading, owner } = useAsset()
  const [isCompute, setIsCompute] = useState(false)
  const [isOnwer, setIsOwner] = useState(false)
  const { accountId } = useWeb3()

  // Switch type value upon tab change
  function handleTabChange(tabName: string) {
    LoggerInstance.log('switched to tab', tabName)
    // add store restore from
  }

  useEffect(() => {
    if (!asset || error) {
      return
    }
    setIsCompute(asset?.services[0]?.type === 'compute')
    setIsOwner(owner === accountId)
  }, [asset, error])

  const tabs = [
    {
      title: 'Edit Metadata',
      content: <EditMetadata asset={asset} />
    },
    {
      title: 'Edit Compute Settings',
      content: <EditComputeDataset asset={asset} />,
      disabled: !isCompute
    }
  ].filter((tab) => tab !== undefined)

  return asset && !loading && isOnwer ? (
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
  ) : !isOnwer ? (
    <Page
      title={'Edit action available only to asset owner'}
      noPageHeader
      uri={uri}
    >
      <Alert
        title={'Edit action available only to asset owner'}
        text={error}
        state="error"
      />
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
