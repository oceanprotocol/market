import React, { useEffect } from 'react'
import styles from './Header.module.css'
import { useWeb3 } from '@context/Web3'
import { useOrbis } from '@context/Orbis'
import { didToAddress } from '@utils/orbis'
import ChatBubble from '@images/chatbubble.svg'
import ArrowBack from '@images/arrow.svg'
import ChevronUp from '@images/chevronup.svg'
import Copy from '@images/copy.svg'

export default function Header() {
  const { accountId } = useWeb3()
  const {
    conversations,
    conversationId,
    openConversations,
    notifications,
    activeConversationTitle,
    newConversation,
    setActiveConversationTitle,
    setNewConversation,
    getConversationTitle,
    setOpenConversations,
    setConversationId
  } = useOrbis()

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    console.log(target)
    const { role } = target.dataset
    if (role) {
      if (role === 'back-button') {
        setConversationId(null)
        setNewConversation(null)
      } else {
        let _address = ''
        if (newConversation) {
          console.log(newConversation.recipients)
          _address = didToAddress(newConversation.recipients[0])
        } else {
          console.log(accountId)
          const conversation = conversations.find(
            (c) => c.stream_id === conversationId
          )
          const recipients = conversation.recipients.filter(
            (r) => didToAddress(r) !== accountId.toLowerCase()
          )
          console.log(recipients)
          _address = didToAddress(recipients[0])
        }
        navigator.clipboard.writeText(_address)
        alert('Address copied to clipboard')
      }
    } else {
      setOpenConversations(!openConversations)
    }
  }

  const setConversationTitle = async (conversationId: string) => {
    if (conversationId.startsWith('new-')) {
      setActiveConversationTitle(conversationId.replace('new-', ''))
    } else {
      const title = await getConversationTitle(conversationId)
      setActiveConversationTitle(title)
    }
  }

  useEffect(() => {
    if (!conversationId) setActiveConversationTitle(null)
    else setConversationTitle(conversationId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  return (
    <div className={styles.header} onClick={handleClick}>
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
              data-role="back-button"
              className={styles.btnBack}
              onClick={handleClick}
            >
              <ArrowBack
                role="img"
                aria-label="arrow"
                className={styles.backIcon}
              />
            </button>
          )}
          {activeConversationTitle && (
            <>
              <span>{activeConversationTitle}</span>
              <button
                onClick={handleClick}
                data-role="copy-address"
                title="Copy Address"
                className={styles.btnCopy}
              >
                <Copy
                  role="img"
                  aria-label="Copy Address"
                  className={styles.copyIcon}
                />
              </button>
            </>
          )}
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
