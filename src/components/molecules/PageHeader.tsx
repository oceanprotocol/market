import React from 'react'
import styles from './PageHeader.module.css'

export default function PageHeader({
  title,
  description
}: {
  title: string
  description?: string
}) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  )
}
