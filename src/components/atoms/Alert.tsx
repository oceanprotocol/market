import React, { ReactElement, FormEvent } from 'react'
import Button from './Button'
import Markdown from './Markdown'
import Badge from './Badge'
import {
  alert,
  title as titleStyle,
  badge as badgeStyle,
  text as textStyle,
  action as actionStyle,
  close as closeStyle
} from './Alert.module.css'

export default function Alert({
  title,
  badge,
  text,
  state,
  action,
  onDismiss,
  className
}: {
  title?: string
  badge?: string
  text: string
  state: 'error' | 'warning' | 'info' | 'success'
  action?: {
    name: string
    style?: 'text' | 'primary' | 'ghost'
    handleAction: (e: FormEvent<HTMLButtonElement>) => void
  }
  onDismiss?: () => void
  className?: string
}): ReactElement {
  return (
    <div className={`${alert} ${[state]} ${className}`}>
      {title && (
        <h3 className={titleStyle}>
          {title} {badge && <Badge className={badgeStyle} label={badge} />}
        </h3>
      )}
      <Markdown className={textStyle} text={text} />
      {action && (
        <Button
          className={actionStyle}
          size="small"
          style={action.style || 'primary'}
          onClick={action.handleAction}
        >
          {action.name}
        </Button>
      )}
      {onDismiss && (
        <button className={closeStyle} onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  )
}
