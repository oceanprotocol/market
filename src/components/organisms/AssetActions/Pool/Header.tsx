import React, { ReactElement } from 'react'
import * as styles from './Header.module.css'
import Button from '../../../atoms/Button'

export default function Header({
  title,
  backAction
}: {
  title: string
  backAction: () => void
}): ReactElement {
  return (
    <header className={styles.header}>
      <Button
        className={styles.back}
        style="text"
        size="small"
        onClick={backAction}
      >
        ← Back
      </Button>
      <h3 className={styles.headerTitle}>{title}</h3>
    </header>
  )
}
