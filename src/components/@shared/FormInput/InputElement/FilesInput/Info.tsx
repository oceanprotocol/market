import React, { ReactElement } from 'react'
import { prettySize } from './utils'
import cleanupContentType from '@utils/cleanupContentType'
import styles from './Info.module.css'
import { FileInfo as FileInfoData } from '@oceanprotocol/lib'

export default function FileInfo({
  file,
  handleClose
}: {
  file: FileInfoData
  handleClose(): void
}): ReactElement {
  const contentTypeCleaned = file.contentType
    ? cleanupContentType(file.contentType)
    : null

  const hideUrl = file.type === 'hidden' || false

  return (
    <div className={`${styles.info}`}>
      <h3 className={`${styles.url} ${hideUrl ? styles.hideUrl : null}`}>
        {hideUrl ? 'https://oceanprotocol/placeholder' : file.url}
      </h3>
      <ul>
        <li className={styles.success}>✓ File confirmed</li>
        {file.contentLength && <li>{prettySize(+file.contentLength)}</li>}
        {contentTypeCleaned && <li>{contentTypeCleaned}</li>}
      </ul>
      <button className={styles.removeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  )
}
