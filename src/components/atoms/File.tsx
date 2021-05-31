import React, { useEffect, useState, ReactElement } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib'
import filesize from 'filesize'
import classNames from 'classnames/bind'
import cleanupContentType from '../../utils/cleanupContentType'
import styles from './File.module.css'
import Loader from '../atoms/Loader'

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
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    isLoading && setLoading(true)
  }, [])

  if (!file) return null
  console.log(isLoading, loading)

  const styleClasses = cx({
    file: true,
    small: small,
    [className]: className
  })

  return !loading && (isLoading === undefined || isLoading === false) ? (
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
  ) : (
    <LoaderArea />
  )
}
