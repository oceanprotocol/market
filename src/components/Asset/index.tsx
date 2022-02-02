import React, { useState, useEffect, ReactElement } from 'react'
import Page from '@shared/Page'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'
import { useAsset } from '@context/Asset'
import AssetContent from './AssetContent'

export default function AssetDetails({ uri }: { uri: string }): ReactElement {
  const { assetExtended, title, error, isInPurgatory, loading, accessDetails } =
    useAsset()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (!assetExtended || error) {
      setPageTitle('Could not retrieve asset')
      return
    }
    setPageTitle(isInPurgatory ? '' : title)
  }, [assetExtended, error, isInPurgatory, title])

  return assetExtended && pageTitle !== undefined && !loading ? (
    <Page title={pageTitle} uri={uri}>
      <AssetContent asset={assetExtended} accessDetails={accessDetails} />
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
