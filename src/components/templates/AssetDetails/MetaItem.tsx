import React from 'react'
import styles from './MetaItem.module.css'

export default function MetaItem({
  title,
  content
}: {
  title: string
  content: any
}) {
  return (
    <div className={styles.metaItem}>
      <h3 className={styles.title}>{title}</h3>
      {content}
    </div>
  )
}
