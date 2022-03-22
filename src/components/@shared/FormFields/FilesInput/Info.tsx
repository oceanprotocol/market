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
  return file.valid ? (
    <div className={styles.info}>
      <h3 className={styles.url}>{file.url}</h3>
      <ul>
        <li className={styles.success}>✓ URL confirmed</li>
        {file.contentLength && <li>{prettySize(+file.contentLength)}</li>}
        {file.contentType && <li>{cleanupContentType(file.contentType)}</li>}
      </ul>
      <button className={styles.removeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  ) : (
    <div className={`${styles.info} ${!file.valid ? styles.hasError : ''}`}>
      <h3 className={styles.url}>{file.url}</h3>
      <ul>
        <li className={styles.error}>
          {' '}
          ✗ No valid file detected. Check your URL and try again.
        </li>
        {file.contentLength && <li>{prettySize(+file.contentLength)}</li>}
        {file.contentType && <li>{cleanupContentType(file.contentType)}</li>}
      </ul>
      <button className={styles.removeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  )
}
