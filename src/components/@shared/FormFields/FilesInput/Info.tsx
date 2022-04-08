import React, { ReactElement } from 'react'
import { prettySize } from './utils'
import cleanupContentType from '@utils/cleanupContentType'
import styles from './Info.module.css'
import { FileMetadata } from '@oceanprotocol/lib'
import Alert from '@shared/atoms/Alert'

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

  // Prevent accidential publishing of error pages (e.g. 404) for
  // popular file hosting services by warning about it.
  // See https://github.com/oceanprotocol/market/issues/1246
  const shouldWarnAboutFile = file.valid && contentTypeCleaned === 'html'

  return (
    <div className={styles.info}>
      <h3 className={styles.url}>{file.url}</h3>
      <ul>
        <li className={styles.success}>✓ URL confirmed</li>
        {file.contentLength && <li>{prettySize(+file.contentLength)}</li>}
        {contentTypeCleaned && <li>{contentTypeCleaned}</li>}
      </ul>
      {shouldWarnAboutFile && (
        <Alert
          state="info"
          text={`Your file was detected as ${contentTypeCleaned}, which is unusal for a data asset. If you did not intend to use a ${contentTypeCleaned} file, try a different URL pointing directly to your data asset file.`}
          className={styles.warning}
        />
      )}
      <button className={styles.removeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  )
}
