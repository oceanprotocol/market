import React, { ReactElement } from 'react'
import filesize from 'filesize'
import classNames from 'classnames/bind'
import cleanupContentType from '@utils/cleanupContentType'
import styles from './index.module.css'
import Loader from '@shared/atoms/Loader'
import { FileInfo } from '@oceanprotocol/lib'

const cx = classNames.bind(styles)

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
  const styleClasses = cx({
    file: true,
    small,
    [className]: className
  })

  return (
    <ul className={styleClasses}>
      {!isLoading && file ? (
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
