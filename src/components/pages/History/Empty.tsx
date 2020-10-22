import React, { ReactElement } from 'react'
import styles from './Empty.module.css'

export default function Empty(): ReactElement {
  return <div className={styles.empty}>No results found</div>
}
