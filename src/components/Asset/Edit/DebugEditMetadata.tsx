import { Asset, Metadata } from '@oceanprotocol/lib'
import React, { ReactElement } from 'react'
import DebugOutput from '@shared/DebugOutput'
import { MetadataEditForm } from './_types'

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
  const updatedAsset: Asset = {
    ...asset,
    metadata: newMetadata
  }

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed Asset Values" output={updatedAsset} />
    </>
  )
}
