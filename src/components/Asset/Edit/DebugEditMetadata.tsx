import { Asset, Metadata, Service } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import DebugOutput from '@shared/DebugOutput'
import { MetadataEditForm } from './_types'
import { mapTimeoutStringToSeconds, previewDebugPatch } from '@utils/ddo'
import { sanitizeUrl } from '@utils/url'

export default function DebugEditMetadata({
  values,
  asset
}: {
  values: Partial<MetadataEditForm>
  asset: Asset
}): ReactElement {
  const [valuePreview, setValuePreview] = useState({})
  const linksTransformed = values.links?.length &&
    values.links[0].valid && [sanitizeUrl(values.links[0].url)]

  const newMetadata: Metadata = {
    ...asset?.metadata,
    name: values.name,
    description: values.description,
    links: linksTransformed,
    author: values.author
  }
  const updatedService: Service = {
    ...asset?.services[0],
    timeout: mapTimeoutStringToSeconds(values.timeout)
  }
  const updatedAsset: Asset = {
    ...asset,
    metadata: newMetadata,
    services: [updatedService]
  }

  useEffect(() => {
    setValuePreview(previewDebugPatch(values, asset.chainId))
  }, [asset.chainId, values])

  return (
    <>
      <DebugOutput title="Collected Form Values" output={valuePreview} />
      <DebugOutput title="Transformed Asset Values" output={updatedAsset} />
    </>
  )
}
