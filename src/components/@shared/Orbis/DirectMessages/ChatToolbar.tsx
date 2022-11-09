import React, { useState } from 'react'
import styles from './ChatToolbar.module.css'
import SendIcon from '@images/send.svg'
import Input from '@shared/FormInput'
import { useOrbis } from '@context/Orbis'
import EmojiPicker from '../EmojiPicker'
import { EmojiClickData } from 'emoji-picker-react'

export default function ChatToolbar({
  callbackMessage
}: {
  callbackMessage: (post: OrbisPostInterface) => void
}) {
  const { orbis, conversationId, account } = useOrbis()
  const [content, setContent] = useState<string>('')

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prevInput) => prevInput + emojiData.emoji)
  }

  const sendMessage = async () => {
    const _callbackMessage: OrbisPostInterface = {
      creator: account.did,
      creator_details: {
        did: account.did,
        profile: account.profile
      },
      stream_id: null,
      content: {
        body: content
      },
      timestamp: Date.now()
    }
    callbackMessage(_callbackMessage)
    setContent('')

    const res = await orbis.sendMessage({
      conversation_id: conversationId,
      body: content
    })

    if (res.status === 200) {
      console.log('succes send message with,', res)
      setContent('')
    }
  }

  return (
    <div className={styles.chatToolbar}>
      <div className={styles.chatMessage}>
        <div className={styles.inputWrap}>
          <Input
            type="input"
            name="message"
            size="small"
            placeholder="Type Message"
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
          />
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
        <button className={styles.button} onClick={sendMessage}>
          <SendIcon className={styles.buttonIcon} />
        </button>
      </div>
    </div>
  )
}
