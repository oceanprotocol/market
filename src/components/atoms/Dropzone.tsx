import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './Dropzone.module.css'
import { formatBytes } from '../../utils'

export default function Dropzone({
  handleOnDrop,
  disabled,
  multiple,
  error
}: {
  handleOnDrop(files: File[]): void
  disabled?: boolean
  multiple?: boolean
  error?: string
}) {
  const onDrop = useCallback((acceptedFiles) => handleOnDrop(acceptedFiles), [
    handleOnDrop
  ])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles
  } = useDropzone({ onDrop })

  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {formatBytes(file.size, 0)}
    </li>
  ))

  return (
    <div
      {...getRootProps({
        className: isDragActive
          ? `${styles.dropzone} ${styles.dragover}`
          : disabled
          ? `${styles.dropzone} ${styles.disabled}`
          : styles.dropzone
      })}
    >
      <div>
        {acceptedFiles.length > 0 ? (
          <aside>
            <ul>{files}</ul>
          </aside>
        ) : (
          <>
            <input {...getInputProps({ multiple })} />

            {isDragActive && !isDragReject ? (
              `Drop it like it's hot!`
            ) : multiple ? (
              `Drag 'n' drop some files here, or click to select files`
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : (
              `Drag 'n' drop a file here, or click to select a file`
            )}
          </>
        )}
      </div>
    </div>
  )
}
