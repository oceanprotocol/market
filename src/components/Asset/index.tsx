import React, { useState, useEffect, ReactElement } from 'react'
import Page from '@shared/Page'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'
import { useAsset } from '@context/Asset'
import AssetContent from './AssetContent'

export default function AssetDetails({ uri }: { uri: string }): ReactElement {
  const { ddo, title, error, isInPurgatory, loading, consumeDetails } =
    useAsset()
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
      <AssetContent ddo={ddo} consumeDetails={consumeDetails} />
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
