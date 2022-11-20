import React from 'react'
import styles from './Header.module.css'
import { useOrbis } from '@context/Orbis'
import ChatBubble from '@images/chatbubble.svg'
import ArrowBack from '@images/arrow.svg'
import ChevronUp from '@images/chevronup.svg'

export default function Header() {
  const {
    // unreadMessages,
    conversationId,
    openConversations,
    conversationTitle,
    setOpenConversations,
    setConversationId
  } = useOrbis()

  return (
    <div className={styles.header}>
      {!conversationId ? (
        <>
          <ChatBubble role="img" aria-label="Chat" className={styles.icon} />
          <span>Direct Messages</span>
          {/* {unreadMessages.length > 0 && (
            <span className={styles.notificationCount}>
              {unreadMessages.length}
            </span>
          )} */}
        </>
      ) : (
        <>
          <button
            type="button"
            aria-label="button"
            className={styles.btnBack}
            onClick={() => setConversationId(null)}
          >
            <ArrowBack role="img" aria-label="arrow" className={styles.back} />
          </button>
          <span>{conversationTitle}</span>
        </>
      )}
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpenConversations(!openConversations)}
      >
        <ChevronUp
          role="img"
          aria-label="Toggle"
          className={`${styles.icon} ${
            openConversations ? styles.isFlipped : ''
          }`}
        />
      </button>
    </div>
  )
}
