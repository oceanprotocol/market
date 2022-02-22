import { Asset, Metadata, Service } from '@oceanprotocol/lib'
import React, { ReactElement } from 'react'
import DebugOutput from '@shared/DebugOutput'
import { MetadataEditForm } from './_types'
import { mapTimeoutStringToSeconds } from '@utils/ddo'

export default function DebugEditMetadata({
  values,
  asset
}: {
  values: Partial<MetadataEditForm>
  asset: Asset
}): ReactElement {
  const newMetadata: Metadata = {
    ...asset.metadata,
    name: values.name,
    description: values.description,
    links: typeof values.links !== 'string' ? values.links : [],
    author: values.author
  }
  const updatedService: Service = {
    ...asset.services[0],
    timeout: mapTimeoutStringToSeconds(values.timeout)
  }
  const updatedAsset: Asset = {
    ...asset,
    metadata: newMetadata,
    services: [updatedService]
  }

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Asset Values" output={updatedAsset} />
    </>
  )
}
