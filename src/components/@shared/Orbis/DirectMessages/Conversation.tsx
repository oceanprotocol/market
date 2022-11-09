import React, { useEffect } from 'react'
import { useOrbis } from '@context/Orbis'
import Time from '@shared/atoms/Time'
import DecryptedMessage from './DecryptedMessage'
import styles from './Conversation.module.css'

export default function DmConversation({
  messages
}: {
  messages: OrbisPostInterface[]
}) {
  const { account } = useOrbis()

  const showTime = (index: number): boolean => {
    const nextMessage = messages[index + 1]
    if (!nextMessage || messages[index].creator !== nextMessage.creator)
      return true

    return nextMessage.timestamp - messages[index].timestamp > 60
  }

  useEffect(() => {
    console.log(messages)
    // messages.forEach((message) => {
    //   decryptMessage(message?.content)
    // })
  }, [messages])

  return (
    <div className={styles.conversationBox}>
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
  )
}
