import React, { useEffect, useState } from 'react'
import { useOrbis } from '@context/Orbis'
import styles from './Conversation.module.css'

function RenderDecryptedMessage({
  content
}: {
  content: OrbisPostContentInterface
}) {
  const { orbis } = useOrbis()
  const [decrypted, setDecrypted] = useState(null)

  useEffect(() => {
    const decryptMessage = async (content: OrbisPostContentInterface) => {
      const res = await orbis.decryptMessage(content)

      if (res) {
        console.log(res)
      }

      setDecrypted(res.result)
    }
    if (content) {
      console.log(content)
      decryptMessage(content)
    }
  }, [content])

  return <>{decrypted}</>
}

export default function DmConversation({
  messages
}: {
  messages: OrbisPostInterface[]
}) {
  const { account } = useOrbis()

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
          className={styles.conversationRecipient}
          key={index}
          data-sender={
            account?.did === message.creator_details.did ? 'home' : 'away'
          }
        >
          <div className={styles.colAvatar}>
            {/* <img src={} alt="Avatar" className={styles.avatar}></img> */}
          </div>
          <div className={styles.colBubble}>
            <div className={styles.chatBubbleItem}>
              <div
                className={`${styles.chatBubble} ${
                  account?.did === message.creator_details.did
                    ? styles.chatPrimary
                    : styles.chatDefault
                }`}
              >
                <RenderDecryptedMessage content={message.content} />
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* <div className={styles.conversationSend}>
          <div className={styles.colBubble}>
            <div className={styles.chatBubbleItem}>
              <div className={`${styles.chatBubble} ${styles.chatDefault}`}>
                {dm.chat3}
              </div>
            </div>
            <div className={styles.chatBubbleItem}>
              <div className={`${styles.chatBubble} ${styles.chatDefault}`}>
                {dm.chat4}
              </div>
            </div>
            <div className={styles.chatBubbleItem}>
              <div className={`${styles.chatBubble} ${styles.chatDefault}`}>
                {dm.chat5}
              </div>
              <div className={styles.chatStamp}>{dm.timestamp}</div>
            </div>
          </div>
        </div>
        <div className={styles.conversationRecipient}>
          <div className={styles.colAvatar}>
            <img src={} alt="Avatar" className={styles.avatar}></img>
          </div>
          <div className={styles.colBubble}>
            <div className={styles.chatBubbleItem}>
              <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                {dm.chat1}
              </div>
            </div>
            <div className={styles.chatBubbleItem}>
              <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                {dm.chat4}
              </div>
            </div>
            <div className={styles.chatBubbleItem}>
              <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                {dm.chat2}
              </div>
              <div className={styles.chatStamp}>{dm.timestamp}</div>
            </div>
          </div>
        </div> */}
    </div>
  )
}
