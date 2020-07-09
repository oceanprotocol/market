import React, { ReactElement } from 'react'
import styles from './Loader.module.css'

export default function Loader({
  message
}: {
  message?: string
}): ReactElement {
  return (
    <div className={styles.loaderWrap}>
      <span className={styles.loader} />
      {message && <span className={styles.message}>{message}</span>}
    </div>
  )
}
