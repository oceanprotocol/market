import { DDO } from '@oceanprotocol/lib'
import React, { ReactElement } from 'react'
import { MetadataPublishFormDataset } from '../../../../@types/MetaData'
import { transformPublishFormToMetadata } from '../../../../utils/metadata'
import DebugOutput from '../../../atoms/DebugOutput'

export default function Debug({
  values,
  ddo
}: {
  values: Partial<MetadataPublishFormDataset>
  ddo: DDO
}): ReactElement {
  const newDdo = {
    '@context': 'https://w3id.org/did/v1',
    service: [
      {
        index: 0,
        type: 'metadata',
        attributes: { ...transformPublishFormToMetadata(values, ddo) }
      }
    ]
  }

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed DDO Values" output={newDdo} />
    </>
  )
}
