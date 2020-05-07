import React from 'react'
import styles from './Status.module.css'

export default function Status({ state }: { state?: string }) {
  const classes =
    state === 'error'
      ? styles.error
      : state === 'warning'
      ? styles.warning
      : styles.status

  return <i className={classes} />
}
