import React, { ReactElement } from 'react'
import Markdown from '../atoms/Markdown'
import Button from '../atoms/Button'
import {
  text as textStyle,
  banner,
  error,
  warning,
  success
} from './AnnouncementBanner.module.css'

export interface AnnouncementAction {
  name: string
  style?: string
  handleAction: () => void
}

export default function AnnouncementBanner({
  text,
  action,
  state,
  className
}: {
  text: string
  action?: AnnouncementAction
  state?: 'success' | 'warning' | 'error'
  className?: string
}): ReactElement {
  const stateStyle =
    state &&
    (state === 'error' ? error : state === 'warning' ? warning : success)
  const styleClasses = `${banner} ${stateStyle} ${className}`

  return (
    <div className={styleClasses}>
      {text && <Markdown className={textStyle} text={text} />}
      {action && (
        <Button style="text" size="small" onClick={action.handleAction}>
          {action.name}
        </Button>
      )}
    </div>
  )
}
