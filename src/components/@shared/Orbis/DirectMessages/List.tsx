import React, { useMemo } from 'react'
import { useOrbis, IConversationWithAdditionalData } from '@context/Orbis'
import ListItem from './ListItem'
import ChatBubble from '@images/chatbubble.svg'
import styles from './List.module.css'

export default function List() {
  const { conversations, setConversationId } = useOrbis()

  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (conversation: IConversationWithAdditionalData) =>
        !conversation.empty_message
    )
  }, [conversations])

  return (
    <div className={styles.conversations}>
      {filteredConversations.length > 0 ? (
        filteredConversations.map(
          (conversation: IConversationWithAdditionalData, index: number) => (
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
