import React, { ReactElement, FormEvent } from 'react'
import classNames from 'classnames/bind'
import styles from './index.module.css'
import Button from '../Button'
import Markdown from '../../Markdown'
import Badge from '../Badge'

const cx = classNames.bind(styles)

export interface AlertProps {
  title?: string
  badge?: string
  text: string
  state: 'error' | 'warning' | 'info' | 'success'
  action?: {
    name: string
    style?: 'text' | 'primary' | 'ghost'
    disabled?: boolean
    handleAction: (e: FormEvent<HTMLButtonElement>) => void
  }
  onDismiss?: () => void
  className?: string
}

export default function Alert({
  title,
  badge,
  text,
  state,
  action,
  onDismiss,
  className
}: AlertProps): ReactElement {
  const styleClasses = cx({
    alert: true,
    [state]: state,
    [className]: className
  })

  return (
    <div className={styleClasses}>
      {title && (
        <h3 className={styles.title}>
          {title} {badge && <Badge className={styles.badge} label={badge} />}
        </h3>
      )}
      <Markdown className={styles.text} text={text} />
      {action && (
        <Button
          className={styles.action}
          size="small"
          style={action.style || 'primary'}
          onClick={action.handleAction}
          disabled={action.disabled}
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
