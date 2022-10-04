import React, { useEffect, useState } from 'react'
// import { useCancelToken } from '@hooks/useCancelToken'
import { useOrbis } from '@context/Orbis'
// import get3BoxProfile from '@utils/profile'
import { didToAddress } from '@utils/orbis'
import Blockies from '@shared/atoms/Blockies'
import styles from './Conversation.module.css'

function RenderDecryptedMessage({
  content
}: {
  content: OrbisPostContentInterface
}) {
  const { orbis } = useOrbis()
  const [loading, setLoading] = useState(true)
  const [decrypted, setDecrypted] = useState(null)

  useEffect(() => {
    const decryptMessage = async (content: OrbisPostContentInterface) => {
      setLoading(true)
      const res = await orbis.decryptMessage(content)

      if (res) {
        console.log(res)
      }

      setDecrypted(res.result)
      setLoading(false)
    }
    if (content) {
      console.log(content)
      decryptMessage(content)
    }
  }, [content])

  return (
    <span className={loading && styles.decrypting}>
      {!loading ? decrypted : '---'}
    </span>
  )
}

export default function DmConversation({
  messages
}: {
  messages: OrbisPostInterface[]
}) {
  const { account } = useOrbis()

  // const newCancelToken = useCancelToken()

  // async function getProfileData(address: string): Promise<string> {
  //   const profile = await get3BoxProfile(address, newCancelToken())
  //   if (!profile) return null
  //   return profile?.image
  // }

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
          className={styles.conversationItem}
          key={index}
          data-type={
            account?.did === message.creator_details.did ? 'right' : 'left'
          }
        >
          {account?.did !== message.creator_details.did && (
            <div className={styles.colAvatar}>
              <Blockies
                accountId={didToAddress(message.creator_details.did)}
                className={styles.avatar}
                // image={getProfileData(
                //   didToAddress(message.creator_details.did)
                // )}
              />
            </div>
          )}
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
