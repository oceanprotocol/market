import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
<<<<<<< HEAD:src/components/@shared/AnnouncementBanner/index.tsx
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
=======
import Markdown from './Markdown'
import Button from './Button'
import styles from './AnnouncementBanner.module.css'
>>>>>>> 14d71ad2 (reorganize all the things):src/components/@shared/atoms/AnnouncementBanner.tsx

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
  state?: 'success' | 'warning' | 'error'
  className?: string
}): ReactElement {
  const styleClasses = cx({
    banner: true,
    error: state === 'error',
    warning: state === 'warning',
    success: state === 'success',
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
