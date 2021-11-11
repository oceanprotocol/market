import React, { ReactElement, useEffect } from 'react'
import { prettySize } from './utils'
import cleanupContentType from '@utils/cleanupContentType'
import styles from './Info.module.css'
import { useField, useFormikContext } from 'formik'
import { FileMetadata } from '@utils/provider'

export default function FileInfo({
  name,
  file
}: {
  name: string
  file: FileMetadata
}): ReactElement {
  const { validateField } = useFormikContext()
  const [field, meta, helpers] = useField(name)

  // On mount, validate the field manually
  useEffect(() => {
    validateField(name)
  }, [name, validateField])

  return (
    <div className={styles.info}>
      {/* <h3 className={styles.url}>{file}</h3> */}
      <ul>
        <li>URL confirmed</li>
        {file.contentLength && <li>{prettySize(+file.contentLength)}</li>}
        {file.contentType && <li>{cleanupContentType(file.contentType)}</li>}
      </ul>
      <button
        className={styles.removeButton}
        onClick={() => helpers.setValue(undefined)}
      >
        &times;
      </button>
    </div>
  )
}
