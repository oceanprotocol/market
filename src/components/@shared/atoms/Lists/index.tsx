import React, { ReactElement, ReactNode } from 'react'
import styles from './index.module.css'

export interface ListItemProps {
  children?: ReactNode
  ol?: boolean
}

export function ListItem({ children, ol }: ListItemProps): ReactElement {
  const classes = ol
    ? `${styles.item} ${styles.olItem}`
    : `${styles.item} ${styles.ulItem}`

  return (
    <li className={classes}>
      <span>{children}</span>
    </li>
  )
}
