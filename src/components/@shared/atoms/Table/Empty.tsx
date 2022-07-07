import React, { ReactElement } from 'react'
import styles from './Empty.module.css'

export default function Empty({ message }: { message?: string }): ReactElement {
  return <div className={styles.empty}>{message || 'No results found'}</div>
}
