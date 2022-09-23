import React, { useState } from 'react'
import ChatBubble from '@images/chatbubble.svg'
import ChevronDoubleUp from '@images/chevrondoubleup.svg'
import styles from './index.module.css'

export default function FloatingChat() {
  const [opened, setOpened] = useState(false)

  return (
    <div className={`${styles.wrapper} ${!opened && styles.isClosed}`}>
      <div className={styles.floating}>
        <div className={styles.header}>
          <ChatBubble role="img" aria-label="Chat" className={styles.icon} />
          <span>Messages</span>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setOpened(!opened)}
          >
            <ChevronDoubleUp
              role="img"
              aria-label="Toggle"
              className={`${styles.icon} ${opened && styles.isFlipped}`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
