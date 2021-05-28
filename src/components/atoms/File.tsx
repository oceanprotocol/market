import React, { ReactElement } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib'
import filesize from 'filesize'
import classNames from 'classnames/bind'
import cleanupContentType from '../../utils/cleanupContentType'
import styles from './File.module.css'

const cx = classNames.bind(styles)

export default function File({
  file,
  className,
  small
}: {
  file: FileMetadata
  className?: string
  small?: boolean
}): ReactElement {
  if (!file) return null
  console.log('FILE DATA: ', file)

  const styleClasses = cx({
    file: true,
    small: small,
    [className]: className
  })

  return (
    <ul className={styleClasses}>
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
