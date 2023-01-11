import React, { ReactElement } from 'react'
import { filesize } from 'filesize'
import cleanupContentType from '@utils/cleanupContentType'
import styles from './index.module.css'
import Loader from '@shared/atoms/Loader'
import { FileInfo } from '@oceanprotocol/lib'

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

export default function FileIcon({
  file,
  className,
  small,
  isLoading
}: {
  file: FileInfo
  className?: string
  small?: boolean
  isLoading?: boolean
}): ReactElement {
  const styleClasses = `${styles.file} ${small ? styles.small : ''} ${
    className || ''
  }`

  return (
    <ul className={styleClasses}>
      {!isLoading ? (
        <>
          {file?.contentType || file?.contentLength ? (
            <>
              <li>{cleanupContentType(file.contentType)}</li>
              <li>
                {file.contentLength && file.contentLength !== '0'
                  ? filesize(Number(file.contentLength)).toString()
                  : ''}
              </li>
              <li>
                {file.type === 'smartcontract' ? 'smart\ncontract' : file.type}
              </li>
            </>
          ) : (
            <li className={styles.empty}>No file info available</li>
          )}
        </>
      ) : (
        <LoaderArea />
      )}
    </ul>
  )
}
