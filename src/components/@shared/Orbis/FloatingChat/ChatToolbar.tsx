import React, { useEffect, useState } from 'react'
import styles from './ChatToolbar.module.css'
import SendIcon from '@images/send.svg'
import EmojiIcon from '@images/emoji.svg'
import Input from '@shared/FormInput'
import { useOrbis } from '@context/Orbis'
import dynamic from 'next/dynamic'
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme
} from 'emoji-picker-react'

export default function ChatToolbar() {
  const { orbis, conversationId } = useOrbis()
  const [content, setContent] = useState<string>('')
  const [showPicker, setShowPicker] = useState(false)

  const Picker = dynamic(
    () => {
      return import('emoji-picker-react')
    },
    { ssr: false }
  )

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent((prevInput) => prevInput + emojiData.emoji)
    setShowPicker(false)
  }

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
        <div className={styles.inputWrap}>
          <Input
            type="input"
            name="message"
            size="small"
            placeholder="Type Message"
            value={content}
            onInput={(e) => setContent(e.target.value)}
          />
          <button
            className={styles.button}
            type="button"
            onClick={() => setShowPicker((val) => !val)}
          >
            <EmojiIcon className={styles.buttonIcon} />
          </button>
        </div>
        <button className={styles.button} onClick={sendMessage}>
          <SendIcon className={styles.buttonIcon} />
        </button>
      </div>
      <div className={styles.pickerBox}>
        {showPicker && (
          <Picker
            onEmojiClick={onEmojiClick}
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.NATIVE}
            autoFocusSearch={false}
            lazyLoadEmojis={true}
            width={324}
            height={400}
          />
        )}
      </div>
    </div>
  )
}
