import React from 'react'
import styles from './Header.module.css'
import { useOrbis } from '@context/Orbis'
import ChatBubble from '@images/chatbubble.svg'
import ArrowBack from '@images/arrow.svg'
import ChevronUp from '@images/chevronup.svg'

export default function Header() {
  const {
    conversationId,
    openConversations,
    conversationTitle,
    unreadMessages,
    setOpenConversations,
    setConversationId
  } = useOrbis()

  const handleToggle = (e: any) => {
    e.preventDefault()
    if (e.target.type === 'button') {
      setConversationId(null)
    } else {
      setOpenConversations(!openConversations)
    }
  }

  return (
    <div className={styles.header} onClick={handleToggle}>
      {!conversationId ? (
        <>
          <div>
            <ChatBubble role="img" aria-label="Chat" className={styles.icon} />
          </div>
          <span>Direct Messages</span>
          {unreadMessages.length > 0 && (
            <span className={styles.notificationCount}>
              {unreadMessages.length}
            </span>
          )}
        </>
      ) : (
        <>
          {openConversations && (
            <button
              type="button"
              aria-label="button"
              className={styles.btnBack}
              onClick={handleToggle}
            >
              <ArrowBack
                role="img"
                aria-label="arrow"
                className={styles.backIcon}
              />
            </button>
          )}
          <span>{conversationTitle}</span>
        </>
      )}
      <div className={styles.toggleArrow}>
        <ChevronUp
          role="img"
          aria-label="Toggle"
          className={`${styles.icon} ${
            openConversations ? styles.isFlipped : ''
          }`}
        />
      </div>
    </div>
  )
}
