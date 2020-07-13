import React, { ReactElement } from 'react'
import styles from './Alert.module.css'

export default function Alert({
  title,
  text,
  state
}: {
  title?: string
  text: string
  state: 'error' | 'warning' | 'info' | 'success'
}): ReactElement {
  return (
    <div className={`${styles.alert} ${styles[state]}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <p className={styles.text}>{text}</p>
    </div>
  )
}
