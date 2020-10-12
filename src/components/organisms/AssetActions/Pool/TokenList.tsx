import React, { ReactElement, ReactNode } from 'react'
import styles from './TokenList.module.css'

export default function TokenList({
  title,
  children,
  highlight
}: {
  title: string | ReactNode
  children: ReactNode
  highlight?: boolean
}): ReactElement {
  return (
    <div className={`${styles.tokeninfo} ${highlight ? styles.highlight : ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tokens}>{children}</div>
    </div>
  )
}
