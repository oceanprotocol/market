import React, { ReactElement } from 'react'
import { MetadataPublishForm } from '../../../@types/MetaData'
import styles from './index.module.css'
import { transformPublishFormToMetadata } from './utils'

export default function Debug({
  values
}: {
  values: Partial<MetadataPublishForm>
}): ReactElement {
  const ddo = {
    '@context': 'https://w3id.org/did/v1',
    dataTokenInfo: {
      ...values.dataTokenOptions
    },
    service: [
      {
        index: 0,
        type: 'metadata',
        attributes: { ...transformPublishFormToMetadata(values) }
      },
      {
        index: 1,
        type: values.access,
        attributes: {}
      }
    ]
  }
  return (
    <div className={styles.grid}>
      <div>
        <h5>Collected Form Values</h5>
        <pre>
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      </div>

      <div>
        <h5>Transformed DDO Values</h5>
        <pre>
          <code>{JSON.stringify(ddo, null, 2)}</code>
        </pre>
      </div>
    </div>
  )
}
