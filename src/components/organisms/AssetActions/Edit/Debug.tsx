import React, { ReactElement } from 'react'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import { transformPublishFormToMetadata } from '../../../pages/Publish/utils'
import DebugOutput from '../../../atoms/DebugOutput'

export default function Debug({
  values
}: {
  values: Partial<MetadataPublishForm>
}): ReactElement {
  const ddo = {
    '@context': 'https://w3id.org/did/v1',
    service: [
      {
        index: 0,
        type: 'metadata',
        attributes: { ...transformPublishFormToMetadata(values) }
      }
    ]
  }

  return (
    <>
      <DebugOutput title="Collected Form Values" output={values} />
      <DebugOutput title="Transformed DDO Values" output={ddo} />
    </>
  )
}
