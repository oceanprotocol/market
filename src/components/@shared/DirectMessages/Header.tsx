import React, { useEffect } from 'react'
import styles from './Header.module.css'
import { useWeb3 } from '@context/Web3'
import { useOrbis } from '@context/DirectMessages'
import { didToAddress } from './_utils'
import { toast } from 'react-toastify'
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
    activeConversationTitle,
    totalNotifications,
    setActiveConversationTitle,
    getConversationTitle,
    setOpenConversations,
    setConversationId
  } = useOrbis()

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    const { role } = target.dataset
    if (role) {
      if (role === 'back-button') {
        setConversationId(null)
      } else {
        let _address = ''
        const conversation = conversations.find(
          (c) => c.stream_id === conversationId
        )
        const recipients = conversation.recipients.filter(
          (r) => didToAddress(r) !== accountId.toLowerCase()
        )
        _address = didToAddress(recipients[0])
        navigator.clipboard.writeText(_address)
        toast.info('Address copied to clipboard')
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
          {totalNotifications > 0 && (
            <span className={styles.notificationCount}>
              {totalNotifications}
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
                type="button"
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
