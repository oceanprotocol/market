import React, { ReactElement } from 'react'
import { MetadataPublishForm } from '../../../@types/MetaData'
import styles from './index.module.css'
import { transformPublishFormToMetadata } from './utils'

export default function Debug({
  values
}: {
  values: Partial<MetadataPublishForm>
}): ReactElement {
  return (
    <div className={styles.grid}>
      <div>
        <h5>Collected Form Values</h5>
        <pre>
          <code>{JSON.stringify(values, null, 2)}</code>
        </pre>
      </div>

      <div>
        <h5>Transformed Values</h5>
        <pre>
          <code>
            {JSON.stringify(transformPublishFormToMetadata(values), null, 2)}
          </code>
        </pre>
      </div>
    </div>
  )
}
