import React, { ReactElement } from 'react'
import styles from './index.module.css'

export interface LoaderProps {
  message?: string
}

export default function Loader({ message }: LoaderProps): ReactElement {
  return (
    <div className={styles.loaderWrap}>
      <span className={styles.loader} />
      {message && <span className={styles.message}>{message}</span>}
    </div>
  )
}
