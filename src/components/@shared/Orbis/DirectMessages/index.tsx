import React from 'react'
import styles from './index.module.css'
import Conversation from './Conversation'
import { useOrbis } from '@context/Orbis'
import Header from './Header'
import List from './List'

export default function DirectMessages() {
  const { openConversations, conversationId } = useOrbis()

  return (
    <div
      className={`${styles.wrapper} ${!openConversations && styles.isClosed}`}
    >
      <div className={styles.floating}>
        <div className={styles.headerWrapper}>
          <Header />
        </div>
        <div className={styles.bodyWrapper}>
          {conversationId ? <Conversation /> : <List />}
        </div>
      </div>
    </div>
  )
}
