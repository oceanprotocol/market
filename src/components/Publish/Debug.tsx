import React, { ReactElement } from 'react'
import DebugOutput from '@shared/DebugOutput'
import styles from './index.module.css'
// import { transformPublishFormToMetadata } from '@utils/metadata'
import { FormPublishData } from './_types'

export default function Debug({
  values
}: {
  values: Partial<FormPublishData>
}): ReactElement {
  // const ddo = {
  //   '@context': 'https://w3id.org/did/v1',
  //   dataTokenInfo: {
  //     ...values.dataTokenOptions
  //   },
  //   service: [
  //     {
  //       index: 0,
  //       type: 'metadata',
  //       attributes: { ...transformPublishFormToMetadata(values) }
  //     },
  //     {
  //       index: 1,
  //       type: values.access,
  //       serviceEndpoint: values.providerUri,
  //       attributes: {}
  //     }
  //   ]
  // }

  return (
    <div className={styles.grid}>
      <DebugOutput title="Collected Form Values" output={values} />
      {/* <DebugOutput title="Transformed DDO Values" output={ddo} /> */}
    </div>
  )
}
