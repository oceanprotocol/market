import React from 'react'
import styles from './Conversation.module.css'

export default function DmConversation() {
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

  return (
    <>
      {dummyData.map((dm, index) => (
        <div className={styles.conversationBox} key={index}>
          <div className={styles.conversationRecipient}>
            <div className={styles.colAvatar}>
              <img src={dm.image} alt="Avatar" className={styles.avatar}></img>
            </div>
            <div className={styles.colBubble}>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                  {dm.chat1}
                </div>
              </div>
              <div className={styles.chatBubbleItem}>
                <div className={`${styles.chatBubble} ${styles.chatPrimary}`}>
                  {dm.chat2}
                </div>
                <div className={styles.chatStamp}>{dm.timestamp}</div>
              </div>
            </div>
          </div>
          <div className={styles.conversationSend}>
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
              <img src={dm.image} alt="Avatar" className={styles.avatar}></img>
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
          </div>
        </div>
      ))}
    </>
  )
}
