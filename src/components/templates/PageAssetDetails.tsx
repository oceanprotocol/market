import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../organisms/AssetContent'
import Page from './Page'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import { useAsset } from '../../providers/Asset'
import removeMarkdown from 'remove-markdown'

export default function PageTemplateAssetDetails({
  uri
}: {
  uri: string
}): ReactElement {
  const { metadata, ddo, title, error, isInPurgatory, loading } = useAsset()
  const [pageTitle, setPageTitle] = useState<string>()

  const metaDescription = removeMarkdown(
    metadata?.additionalInformation?.description?.substring(0, 150) || ''
  )

  useEffect(() => {
    if (!ddo || error) {
      setPageTitle('Could not retrieve asset')
      return
    }

    setPageTitle(isInPurgatory ? '' : title)
  }, [ddo, error, isInPurgatory, title])

  return ddo && pageTitle !== undefined && !loading ? (
    <Page title={pageTitle} uri={uri} metadescription={metaDescription}>
      <Router basepath="/asset">
        <AssetContent path=":did" />
      </Router>
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
