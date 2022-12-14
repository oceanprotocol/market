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
    notifications,
    setOpenConversations,
    setConversationId
  } = useOrbis()

  const handleToggle = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    if (target.tagName === 'BUTTON') {
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
          {Object.values(notifications).flat().length > 0 && (
            <span className={styles.notificationCount}>
              {Object.values(notifications).flat().length}
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
