import React from 'react'
import styles from './Lists.module.css'

export function ListItem({ children, ol }: { children: any; ol?: boolean }) {
  const classes = ol
    ? `${styles.item} ${styles.olItem}`
    : `${styles.item} ${styles.ulItem}`

  return (
    <li className={classes}>
      <span>{children}</span>
    </li>
  )
}
