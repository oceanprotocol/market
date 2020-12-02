import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../organisms/AssetContent'
import Page from './Page'
import { MetadataMarket } from '../../@types/MetaData'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import { useAsset } from '../../providers/Asset'

export default function PageTemplateAssetDetails({
  uri
}: {
  uri: string
}): ReactElement {
  const { isInPurgatory } = useAsset()
  const [metadata, setMetadata] = useState<MetadataMarket>()
  const [title, setTitle] = useState<string>()
  const { ddo, error } = useAsset()

  useEffect(() => {
    if (!ddo || error) {
      setTitle('Could not retrieve asset')
      return
    }

    const { attributes } = ddo.findServiceByType('metadata')
    setTitle(attributes.main.name)
    setMetadata((attributes as unknown) as MetadataMarket)
  }, [ddo, error])

  return ddo && metadata ? (
    <>
      <Page title={isInPurgatory ? '' : title} uri={uri}>
        <Router basepath="/asset">
          <AssetContent
            ddo={ddo}
            metadata={metadata as MetadataMarket}
            path=":did"
          />
        </Router>
      </Page>
    </>
  ) : error ? (
    <Page title={title} noPageHeader uri={uri}>
      <Alert title={title} text={error} state="error" />
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
