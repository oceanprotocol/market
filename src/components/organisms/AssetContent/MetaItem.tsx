import React, { ReactElement, ReactNode } from 'react'
import styles from './MetaItem.module.css'
import { syncBuiltinESMExports } from 'module'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/github-gist'

export default function MetaItem({
  title,
  content
}: {
  title: string
  content: ReactNode
}): ReactElement {
  return (
    <div className={styles.metaItem}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{content}</div>
    </div>
  )
}
