import React, { useState, useEffect } from 'react'
import ChatBubble from '@images/chatbubble.svg'
import ArrowBack from '@images/arrow.svg'
import ChevronDoubleUp from '@images/chevrondoubleup.svg'
import styles from './index.module.css'
import Conversation from './Conversation'
import ChatToolbar from './ChatToolbar'
import { useOrbis } from '@context/Orbis'

export default function FloatingChat() {
  const [opened, setOpened] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])

  const { orbis, account } = useOrbis()

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

  useEffect(() => {
    if (orbis && account) {
      getConversations()
    }
  }, [orbis, account])

  const getMessages = async (id: string) => {
    const { data, error } = await orbis.getMessages(id)

    if (data) {
      console.log(data)
      setMessages(data)
    }
    if (error) {
      console.log(error)
    }
  }

  const dummyData = [
    {
      name: '0xd30D…AFbD',
      chat: 'Hello world!',
      date: '15 Minutes Ago',
      image: '/apple-touch-icon.png',
      count: '3'
    },
    {
      name: 'realdatawhale.eth',
      chat: 'Getting some similar glitches with profile NFT. The current non-NFT photo works fine.',
      date: '1 Day Ago',
      image: '/apple-touch-icon.png',
      count: '1'
    },
    {
      name: 'hidetaka.eth',
      chat: 'I already updated in the past.',
      date: '1 Oct',
      image: '/apple-touch-icon.png',
      count: '0'
    },
    {
      name: 'orbisclub.eth',
      chat: 'Yeah that is weird, Did you update your profile within Orbis or with an app you built',
      date: '1 Oct',
      image: '/apple-touch-icon.png',
      count: '0'
    }
  ]

  const sumCount = dummyData.reduce(function (prev, current) {
    return prev + +current.count
  }, 0)

  function openConversation(id: string) {
    setConversationId(id)
    getMessages(id)
  }

  return (
    <div className={`${styles.wrapper} ${!opened && styles.isClosed}`}>
      <div className={styles.floating}>
        <div className={styles.header}>
          <ChatBubble role="img" aria-label="Chat" className={styles.icon} />
          <span>Direct Messages</span>
          {sumCount > 0 && <span className={styles.dmCount}>{sumCount}</span>}
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
        <div className={styles.dmList}>
          {conversations.map((dm, index) => (
            <div
              key={index}
              className={styles.dmItem}
              onClick={() => openConversation(dm.stream_id)}
            >
              <div className={styles.accountAvatarSet}>
                <img
                  src={dm.image}
                  alt="Avatar"
                  className={styles.accountAvatar}
                ></img>
                {dm.count > '0' && (
                  <div className={styles.dmCount}>{dm.count}</div>
                )}
              </div>
              <div className={styles.accountInfo}>
                <div className={styles.accountHeading}>
                  <h3 className={styles.accountName}>{dm.name}</h3>
                  <span className={styles.dmDate}>{dm.date}</span>
                </div>
                <p className={styles.accountChat}>{dm.chat}</p>
              </div>
            </div>
          ))}
        </div>
        {conversationId && (
          <div className={styles.conversationId}>
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
              <span>{conversationId}</span>
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
            <Conversation messages={messages} orbis={orbis} />
            <ChatToolbar />
          </div>
        )}
      </div>
    </div>
  )
}
