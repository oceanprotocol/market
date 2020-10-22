import React, { ReactElement } from 'react'
import { MetadataPublishForm } from '../../../@types/MetaData'
import styles from './index.module.css'
import { transformPublishFormToMetadata } from './utils'

const Output = ({ title, output }: { title: string; output: any }) => (
  <div>
    <h5>{title}</h5>
    <pre>
      <code>{JSON.stringify(output, null, 2)}</code>
    </pre>
  </div>
)

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
      <Output title="Collected Form Values" output={values} />
      <Output title="Transformed DDO Values" output={ddo} />
    </div>
  )
}
