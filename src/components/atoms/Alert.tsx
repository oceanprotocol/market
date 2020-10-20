import React, { ReactElement, FormEvent } from 'react'
import styles from './Alert.module.css'
import Button from './Button'

export default function Alert({
  title,
  text,
  state,
  action
}: {
  title?: string
  text: string
  state: 'error' | 'warning' | 'info' | 'success'
  action?: {
    name: string
    handleAction: (e: FormEvent<HTMLButtonElement>) => void
  }
}): ReactElement {
  return (
    <div className={`${styles.alert} ${styles[state]}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <p className={styles.text}>{text}</p>
      {action && (
        <Button
          className={styles.action}
          size="small"
          style="primary"
          onClick={action.handleAction}
        >
          {action.name}
        </Button>
      )}
    </div>
  )
}
