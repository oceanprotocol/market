import React, { useEffect } from 'react'
import styles from './Conversation.module.css'

export default function DmConversation({
  messages,
  orbis
}: {
  messages: OrbisPostInterface[]
  orbis: OrbisInterface
}) {
  const dummyData = [
    {
      name: 'realdatawhale.eth',
      image: '/apple-touch-icon.png',
      chat1: 'Hello friend whats up!',
      chat2:
        'I have this exact same issue with using brave browser. It wont prompt for metamask instead asking to connect to brave wallet.',
      chat3: 'Hello!',
      chat4: 'Yeah thats weird!',
      chat5:
        'Did you update your profile within Orbis or with an app you built?!',
      timestamp: 'Jul 27, 2022, 3:39 AM'
    }
  ]

  const decryptMessage = async (content: OrbisPostContentInterface) => {
    const res = await orbis.decryptMessage(content)

    if (res) {
      console.log(res)
    }
    return <>{res.result}</>
  }

  useEffect(() => {
    console.log(messages)
    messages.forEach((message) => {
      decryptMessage(message?.content)
    })
  }, [messages])

  return (
    <>
      {messages.map((dm, index) => (
        <div className={styles.conversationBox} key={index}>
          <div className={styles.conversationRecipient}>
            <div className={styles.colAvatar}>
              {/* <img src={} alt="Avatar" className={styles.avatar}></img> */}
            </div>
            <div className={styles.colBubble}>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                  (<>{decryptMessage(dm.content)}</>)
                </div>
              </div>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                  {/* {dm.chat2} */}
                </div>
                <div className={styles.chatStamp}>{dm.timestamp}</div>
              </div>
            </div>
          </div>
          <div className={styles.conversationSend}>
            <div className={styles.colBubble}>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatDefault}`}>
                  {/* {dm.chat3} */}
                </div>
              </div>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatDefault}`}>
                  {/* {dm.chat4} */}
                </div>
              </div>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatDefault}`}>
                  {/* {dm.chat5} */}
                </div>
                <div className={styles.chatStamp}>{dm.timestamp}</div>
              </div>
            </div>
          </div>
          <div className={styles.conversationRecipient}>
            <div className={styles.colAvatar}>
              {/* <img src={} alt="Avatar" className={styles.avatar}></img> */}
            </div>
            <div className={styles.colBubble}>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                  {/* {dm.chat1} */}
                </div>
              </div>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                  {/* {dm.chat4} */}
                </div>
              </div>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                  {/* {dm.chat2} */}
                </div>
                <div className={styles.chatStamp}>{dm.timestamp}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
