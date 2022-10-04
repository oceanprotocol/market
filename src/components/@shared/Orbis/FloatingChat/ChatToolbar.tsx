import React, { useEffect, useState } from 'react'
import styles from './ChatToolbar.module.css'
import SendIcon from '@images/send.svg'
import Input from '@shared/FormInput'
import { useOrbis } from '@context/Orbis'

export default function ChatToolbar() {
  const { orbis, conversationId } = useOrbis()
  const [content, setContent] = useState()

  useEffect(() => {
    console.log(content)
  }, [content])

  const sendMessage = async () => {
    const res = await orbis.sendMessage({
      conversation_id: conversationId,
      body: content
    })

    if (res.status === 200) {
      console.log('succes send message with,', res)
    }
  }

  return (
    <div className={styles.chatToolbar}>
      <div className={styles.chatMessage}>
        <Input
          type="input"
          name="message"
          size="small"
          placeholder="Type Message"
          value={content}
          onInput={(e) => setContent(e.target.value)}
        />
        <button className={styles.button} onClick={sendMessage}>
          <SendIcon className={styles.sendIcon} />
        </button>
      </div>
    </div>
  )
}
