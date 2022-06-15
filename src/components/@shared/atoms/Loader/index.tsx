import React, { ReactElement } from 'react'
import styles from './index.module.css'

export interface LoaderProps {
  message?: string
  white?: boolean
}

export default function Loader({ message, white }: LoaderProps): ReactElement {
  return (
    <div className={styles.loaderWrap}>
      <span className={`${styles.loader} ${white ? styles.white : ''}`} />
      {message && <span className={styles.message}>{message}</span>}
    </div>
  )
}
