import React from 'react'
import styles from './Alert.module.css'

export function Alert({
  title,
  text,
  state
}: {
  title: string
  text: string
  state: 'error' | 'warning' | 'info' | 'success'
}) {
  return (
    <div className={`${styles.alert} ${styles[state]}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
