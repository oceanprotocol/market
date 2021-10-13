import React, { ReactElement } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib'
import filesize from 'filesize'
import classNames from 'classnames/bind'
import cleanupContentType from '@utils/cleanupContentType'
import styles from './File.module.css'
import Loader from './Loader'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

export default function File({
  file,
  className,
  small,
  isLoading
}: {
  file: FileMetadata
  className?: string
  small?: boolean
  isLoading?: boolean
}): ReactElement {
  if (!file) return null

  const styleClasses = cx({
    file: true,
    small: small,
    [className]: className
  })

  return (
    <ul className={styleClasses}>
      {isLoading === false || isLoading === undefined ? (
        <>
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
        </>
      ) : (
        <LoaderArea />
      )}
    </ul>
  )
}
