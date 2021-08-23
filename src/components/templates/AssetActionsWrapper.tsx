import React, { useState, useEffect, ReactElement } from 'react'
import Page from './Page'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import { useAsset } from '../../providers/Asset'
import AssetActions from '../organisms/AssetActions'
import styles from '../organisms/AssetContent/index.module.css'

export default function AssetActionsWrapper({
  uri
}: {
  uri: string
}): ReactElement {
  const { ddo, title, error, isInPurgatory, loading } = useAsset()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (!ddo || error) {
      setPageTitle('Could not retrieve asset')
      return
    }

    setPageTitle(isInPurgatory ? '' : title)
  }, [ddo, error, isInPurgatory, title])

  return ddo && pageTitle !== undefined && !loading ? (
    <Page title={pageTitle} uri={uri}>
      <div className={styles.actions}>
        <AssetActions />
      </div>
    </Page>
  ) : error ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <Alert title={pageTitle} text={error} state="error" />
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
