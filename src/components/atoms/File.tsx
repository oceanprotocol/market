import React, { ReactElement } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib'
import filesize from 'filesize'
import cleanupContentType from '../../utils/cleanupContentType'
import {
  file as fileStyle,
  small as smallStyle,
  empty
} from './File.module.css'

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

  return (
    <ul className={`${fileStyle} ${small && smallStyle} ${className}`}>
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
        <li className={empty}>No file info available</li>
      )}
    </ul>
  )
}
