import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../organisms/AssetContent'
import Page from './Page'
import { MetadataMarket } from '../../@types/MetaData'
import { MetadataCache, Logger, DDO } from '@oceanprotocol/lib'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import { useOcean } from '@oceanprotocol/react'
import { useAsset } from '../../providers/Asset'

export default function PageTemplateAssetDetails({
  did,
  uri
}: {
  did: string
  uri: string
}): ReactElement {
  const { config } = useOcean()
  const { isInPurgatory, purgatoryData } = useAsset()
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
      {isInPurgatory && purgatoryData && (
        <Alert
          title="Data Set In Purgatory"
          badge={`Reason: ${purgatoryData.reason}`}
          text="Except for removing liquidity, no further actions are permitted on this data set and it will not be returned in any search. For more details go to [list-purgatory](https://github.com/oceanprotocol/list-purgatory)."
          state="error"
        />
      )}
      <Page title={title} uri={uri}>
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
