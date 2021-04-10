import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import Markdown from '../atoms/Markdown'
import Button from '../atoms/Button'
import styles from './AnnouncementBanner.module.css'

const cx = classNames.bind(styles)

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
  state?: 'error'
  className?: string
}): ReactElement {
  const styleClasses = cx({
    banner: true,
    error: state === 'error',
    [className]: className
  })

  return (
    <div className={styleClasses}>
      {text && <Markdown className={styles.text} text={text} />}
      {action && (
        <Button style="text" size="small" onClick={action.handleAction}>
          {action.name}
        </Button>
      )}
    </div>
  )
}
