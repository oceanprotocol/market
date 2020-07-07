import React, { ReactElement } from 'react'
import styles from './Loader.module.css'

export default function Loader({
  message,
  isHorizontal
}: {
  message?: string
  isHorizontal?: boolean
}): ReactElement {
  return (
    <div className={styles.loaderWrap}>
      <span
        className={isHorizontal ? styles.loaderHorizontal : styles.loader}
      />
      {message || null}
    </div>
  )
}
