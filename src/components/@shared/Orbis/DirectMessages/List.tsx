import React from 'react'
import { useOrbis } from '@context/Orbis'
import ListItem from './ListItem'
import ChatBubble from '@images/chatbubble.svg'
import styles from './List.module.css'

export default function List() {
  const { conversations, unreadMessages, setConversationId } = useOrbis()

  const getConversationUnreads = (conversationId: string) => {
    const _unreads = unreadMessages.filter(
      (o) => o.content.conversation_id === conversationId
    )
    return _unreads.length
  }

  return (
    <div className={styles.conversations}>
      {conversations.length > 0 ? (
        conversations.map((conversation: IOrbisConversation, index: number) => (
          <ListItem
            key={index}
            conversation={conversation}
            unreads={getConversationUnreads(conversation.stream_id)}
            setConversationId={setConversationId}
          />
        ))
      ) : (
        <div className={styles.empty}>
          <ChatBubble role="img" aria-label="Chat" className={styles.icon} />
          <span>No conversation yet...</span>
        </div>
      )}
    </div>
  )
}
