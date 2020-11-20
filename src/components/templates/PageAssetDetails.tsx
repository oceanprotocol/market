import React, { useState, useEffect, ReactElement } from 'react'
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
        <AssetContent ddo={ddo} metadata={metadata as MetadataMarket} />
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
