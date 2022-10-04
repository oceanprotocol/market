import React, { useState, useEffect } from 'react'
import ChatBubble from '@images/chatbubble.svg'
import ArrowBack from '@images/arrow.svg'
import ChevronDoubleUp from '@images/chevrondoubleup.svg'
import styles from './index.module.css'
import Conversation from './Conversation'
import ChatToolbar from './ChatToolbar'
import { useOrbis } from '@context/Orbis'
import ConversationItem from './ConversationItem'

export default function FloatingChat() {
  const { orbis, account } = useOrbis()

  const [opened, setOpened] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [conversationTitle, setConversationTitle] = useState(null)
  const [unreads, setUnreads] = useState([])

  const getConversations = async () => {
    const { data, error } = await orbis.getConversations({ did: account?.did })

    if (data) {
      console.log(data)
      setConversations(data)
    }
    if (error) {
      console.log(error)
    }
  }

  const getNotifications = async () => {
    const { data, error } = await orbis.api.rpc('orbis_f_notifications', {
      user_did: account?.did || 'none',
      notif_type: 'messages'
    })

    if (error) {
      console.log(error)
    }

    if (data.length > 0) {
      const _unreads = data.filter((o: OrbisNotificationInterface) => {
        return o.status === 'new'
      })
      setUnreads(_unreads)
    }
  }

  const getConversationUnreads = (conversationId: string) => {
    const _unreads = unreads.filter(
      (o) => o.content.conversation_id === conversationId
    )
    return _unreads.length
  }

  useEffect(() => {
    if (orbis && account) {
      getNotifications()
      getConversations()
    }
  }, [orbis, account])

  const getMessages = async (id: string) => {
    const { data, error } = await orbis.getMessages(id)

    if (data) {
      data.reverse()
      // const _messages = [...messages, ...data]
      setMessages(data)
    }
    if (error) {
      console.log(error)
    }
  }

  function openConversation(conversation: OrbisConversationInterface | null) {
    if (!conversation) {
      setConversationId(null)
      setConversationTitle(null)
      setMessages([])
    } else {
      setConversationId(conversation.stream_id)
      getMessages(conversation.stream_id)
      // Get conversation title
      const recipient = conversation.recipients_details.find(
        (o) => o.did !== account.did
      )
      setConversationTitle(recipient?.metadata?.ensName)
    }
  }

  return (
    <div className={`${styles.wrapper} ${!opened && styles.isClosed}`}>
      <div className={styles.floating}>
        <div className={styles.header}>
          <ChatBubble role="img" aria-label="Chat" className={styles.icon} />
          <span>Direct Messages</span>
          {unreads.length > 0 && (
            <span className={styles.notificationCount}>{unreads.length}</span>
          )}
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
        <div className={styles.conversations}>
          {conversations.map((conversation, index) => (
            <ConversationItem
              key={index}
              conversation={conversation}
              unreads={getConversationUnreads(conversation.stream_id)}
              onClick={() => openConversation(conversation)}
            />
          ))}
        </div>
        {conversationId && (
          <div className={styles.conversation}>
            <div className={styles.header}>
              <button
                type="button"
                aria-label="button"
                className={styles.btnBack}
                onClick={() => openConversation(null)}
              >
                <ArrowBack
                  role="img"
                  aria-label="arrow"
                  className={styles.back}
                />
              </button>
              <span>{conversationTitle}</span>
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
            <Conversation messages={messages} />
            <ChatToolbar />
          </div>
        )}
      </div>
    </div>
  )
}
