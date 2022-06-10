// Copyright Ocean Protocol contributors
// SPDX-License-Identifier: Apache-2.0
import React, { ReactElement } from 'react'
import { prettySize } from './utils'
import cleanupContentType from '@utils/cleanupContentType'
import styles from './Info.module.css'
import { FileMetadata } from '@oceanprotocol/lib'

export default function FileInfo({
  file,
  handleClose
}: {
  file: FileMetadata
  handleClose(): void
}): ReactElement {
  const contentTypeCleaned = file.contentType
    ? cleanupContentType(file.contentType)
    : null

  return (
    <div className={styles.info}>
      <h3 className={styles.url}>{file.url}</h3>
      <ul>
        {file.url?.length > 0 ? (
          <li className={styles.success}>✓ URL confirmed</li>
        ) : (
          <li className={styles.success}>✓ Valid file</li>
        )}
        {file.contentLength && <li>{prettySize(+file.contentLength)}</li>}
        {contentTypeCleaned && <li>{contentTypeCleaned}</li>}
      </ul>
      <button className={styles.removeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  )
}
