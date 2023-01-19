import React from 'react'
import { useOrbis, IConversationWithNotifsCount } from '@context/Orbis'
import ListItem from './ListItem'
import ChatBubble from '@images/chatbubble.svg'
import styles from './List.module.css'

export default function List() {
  const { conversations, setConversationId } = useOrbis()

  return (
    <div className={styles.conversations}>
      {conversations.length > 0 ? (
        conversations.map(
          (conversation: IConversationWithNotifsCount, index: number) => (
            <ListItem
              key={index}
              conversation={conversation}
              setConversationId={setConversationId}
            />
          )
        )
      ) : (
        <div className={styles.empty}>
          <ChatBubble role="img" aria-label="Chat" className={styles.icon} />
          <p>
            Hello! Any question regarding a specific dataset listed on Ocean
            Marketplace?
          </p>
          <p>
            Go over the asset detail page or directly to a publisher profile to
            start a conversation!
          </p>
        </div>
      )}
    </div>
  )
}
