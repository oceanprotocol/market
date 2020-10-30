import React, { ReactElement, FormEvent } from 'react'
import styles from './Alert.module.css'
import Button from './Button'
import Markdown from './Markdown'

export default function Alert({
  title,
  text,
  state,
  action,
  onDismiss
}: {
  title?: string
  text: string
  state: 'error' | 'warning' | 'info' | 'success'
  action?: {
    name: string
    handleAction: (e: FormEvent<HTMLButtonElement>) => void
  }
  onDismiss?: () => void
}): ReactElement {
  return (
    <div className={`${styles.alert} ${styles[state]}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <Markdown className={styles.text} text={text} />
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
      {onDismiss && (
        <button className={styles.close} onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  )
}
