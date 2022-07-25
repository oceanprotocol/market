import React, { useState, useEffect, ReactElement } from 'react'
import { useRouter } from 'next/router'
import Page from '@shared/Page'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'
import { useAsset } from '@context/Asset'
import AssetContent from './AssetContent'
import { v3MarketUri } from 'app.config'

export default function AssetDetails({ uri }: { uri: string }): ReactElement {
  const router = useRouter()
  const { asset, title, error, warning, isInPurgatory, loading, isV3Asset } =
    useAsset()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (isV3Asset) {
      router.push(`${v3MarketUri}${uri}`)
    }
    if (!asset || error || warning) {
      setPageTitle(title || 'Could not retrieve asset')
      return
    }
    setPageTitle(isInPurgatory ? '' : title)
  }, [asset, error, warning, isInPurgatory, isV3Asset, router, title, uri])

  return asset && pageTitle !== undefined && !loading ? (
    <Page title={pageTitle} uri={uri}>
      <AssetContent asset={asset} />
    </Page>
  ) : (warning || error) && isV3Asset === false ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <Alert
        title={pageTitle}
        text={warning || error}
        state={warning ? 'warning' : 'error'}
      />
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
