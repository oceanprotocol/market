import React, { ReactElement } from 'react'
import { File } from '@oceanprotocol/lib'
import { prettySize } from '../../../utils'
import cleanupContentType from '../../../utils/cleanupContentType'
import styles from './Info.module.css'

export default function FileInfo({
  file,
  removeItem
}: {
  file: File
  removeItem(): void
}): ReactElement {
  return (
    <div className={styles.info}>
      <h3 className={styles.url}>{file.url}</h3>
      <ul>
        <li>URL confirmed</li>
        {file.contentLength && <li>{prettySize(+file.contentLength)}</li>}
        {file.contentType && <li>{cleanupContentType(file.contentType)}</li>}
      </ul>
      <button className={styles.removeButton} onClick={() => removeItem()}>
        &times;
      </button>
    </div>
  )
}
