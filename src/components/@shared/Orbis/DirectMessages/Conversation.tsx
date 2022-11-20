import React, { useState, useEffect, useRef } from 'react'
import { useOrbis } from '@context/Orbis'
import { useIsMounted } from '@hooks/useIsMounted'
import { useInterval } from '@hooks/useInterval'
import { throttle } from '@utils/throttle'
import Time from '@shared/atoms/Time'
import Button from '@shared/atoms/Button'
import DecryptedMessage from './DecryptedMessage'
import Postbox from './Postbox'
import styles from './Conversation.module.css'

export default function DmConversation() {
  const { orbis, account, conversationId, hasLit, connectLit } = useOrbis()
  const isMounted = useIsMounted()

  const messagesWrapper = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<IOrbisMessage[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [newMessages, setNewMessages] = useState(0)

  const scrollToBottom = (smooth = false) => {
    setTimeout(() => {
      messagesWrapper.current.scrollTo({
        top: messagesWrapper.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }, 300)
  }

  const getMessages = async (polling = false) => {
    if (isLoading) return

    if (!polling) setIsLoading(true)

    const _page = polling ? 0 : currentPage
    const { data, error } = await orbis.getMessages(conversationId, _page)

    if (error) {
      console.log(error)
    }

    if (data) {
      data.reverse()
      if (!polling) {
        setHasMore(data.length >= 50)
        const _messages = [...data, ...messages]
        setMessages(_messages)
        if (currentPage === 0) scrollToBottom()
        setCurrentPage((prev) => prev + 1)
      } else {
        const unique = data.filter(
          (a) => !messages.some((b) => a.stream_id === b.stream_id)
        )
        setNewMessages(unique.length)
        setMessages([...messages, ...unique])
      }
    }

    setIsLoading(false)
  }

  useInterval(async () => {
    await getMessages(true)
  }, 7000)

  const showTime = (index: number): boolean => {
    const nextMessage = messages[index + 1]
    if (!nextMessage || messages[index].creator !== nextMessage.creator)
      return true

    return nextMessage.timestamp - messages[index].timestamp > 60
  }

  const callback = (nMessage: IOrbisMessage) => {
    const _messages = [...messages, nMessage]
    setMessages(_messages)
    scrollToBottom()
  }

  const onScrollMessages = throttle(() => {
    const el = messagesWrapper.current

    if (hasMore && el.scrollTop === 0) {
      getMessages()
    }

    if (
      Math.ceil(el.scrollTop) >= Math.floor(el.scrollHeight - el.offsetHeight)
    ) {
      setNewMessages(0)
    }
  }, 1000)

  useEffect(() => {
    if (isMounted) {
      if (conversationId && orbis) {
        getMessages()
      } else {
        setMessages([])
      }
    }
  }, [conversationId, orbis, isMounted])

  useEffect(() => {
    const el = messagesWrapper.current

    el.addEventListener('scroll', onScrollMessages)

    return () => {
      el.removeEventListener('scroll', onScrollMessages)
    }
  }, [messagesWrapper])

  return (
    <div className={styles.conversation}>
      {!hasLit ? (
        <div className={styles.connectLit}>
          <p>
            You need to configure your private account to access your private
            conversations.
          </p>
          <Button
            style="primary"
            size="small"
            disabled={false}
            onClick={() => connectLit()}
          >
            Generate private account
          </Button>
        </div>
      ) : (
        <>
          {isLoading && <div className={styles.loading}>Loading...</div>}
          <div className={styles.messages}>
            <div ref={messagesWrapper} className={styles.scrollContent}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${
                    account?.did === message.creator_details.did
                      ? styles.right
                      : styles.left
                  } ${showTime(index) && styles.showTime}`}
                >
                  <div className={styles.chatBubble}>
                    <DecryptedMessage content={message.content} />
                  </div>
                  <div className={styles.time}>
                    <Time
                      date={message.timestamp.toString()}
                      isUnix={true}
                      relative={false}
                      displayFormat="MMM d, yyyy, h:mm aa"
                    />
                  </div>
                </div>
              ))}
            </div>

            {newMessages > 0 && (
              <button
                className={styles.newMessagesBadge}
                onClick={() => scrollToBottom(true)}
              >
                {newMessages} new {newMessages > 1 ? 'messages' : 'message'}
              </button>
            )}
          </div>
          <Postbox conversationId={conversationId} callback={callback} />
        </>
      )}
    </div>
  )
}
