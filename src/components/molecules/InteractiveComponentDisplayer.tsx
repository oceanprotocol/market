import React, { ReactElement } from 'react'
import styles from './InteractiveComponentDisplayer.module.css'

export default function InteractiveComponentDisplayer({
  children
}: {
  children?: ReactElement
}): ReactElement {
  if (!children) return
  return <div className={styles.interactive}>{children}</div>
}
