import React, { ReactElement } from 'react'
import { File as FileMetaData } from '@oceanprotocol/squid'
import filesize from 'filesize'
import cleanupContentType from '../../utils/cleanupContentType'
import styles from './File.module.css'

export default function File({ file }: { file: FileMetaData }): ReactElement {
  if (!file) return null

  return (
    <ul className={styles.file}>
      {file.contentType || file.contentLength ? (
        <>
          <li>{cleanupContentType(file.contentType)}</li>
          <li>
            {file.contentLength && file.contentLength !== '0'
              ? filesize(Number(file.contentLength))
              : ''}
          </li>
        </>
      ) : (
        <li className={styles.empty}>No file info available</li>
      )}
    </ul>
  )
}
