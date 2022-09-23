import React, { useState } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import ChatBubble from '@images/chatbubble.svg'
import styles from './index.module.css'

export default function FloatingChat() {
  const [opened, setOpened] = useState(false)

  return (
    <div className={`${styles.conversation}`}>
      <Tooltip
        content={
          <div className={styles.box}>
            <div className={styles.header}>Header</div>
            <div className={styles.body}>Messages</div>
            <div className={styles.footer}>Postbox</div>
          </div>
        }
        trigger="click focus"
        className={styles.toggler}
        placement="top-end"
      >
        <ChatBubble aria-label="Messages" className={styles.icon} />
      </Tooltip>
    </div>
  )
}
