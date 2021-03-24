import React, { ReactElement, FormEvent } from 'react'
import styles from './AnnouncementBanner.module.css'
import Markdown from '../atoms/Markdown'

export interface AnnouncementAction {
  name: string
  style?: 'text' | 'primary' | 'ghost'
  handleAction: (e: FormEvent<HTMLButtonElement>) => void
}

export default function AnnouncementBanner({
  text,
  action
}: {
  text: string
  action?: AnnouncementAction
}): ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <Markdown className={styles.text} text={text} />
        {action && (
          <button className={styles.button} onClick={action.handleAction}>
            {action.name}
          </button>
        )}
      </div>
    </div>
  )
}
