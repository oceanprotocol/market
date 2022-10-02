import React from 'react'
import styles from './ChatToolbar.module.css'
import SendIcon from '@images/send.svg'
import Input from '@shared/FormInput'

export default function ChatToolbar() {
  return (
    <div className={styles.chatToolbar}>
      <form className={styles.chatMessage}>
        <Input
          type="input"
          name="message"
          size="small"
          placeholder="Type Message"
        />
        <button className={styles.button}>
          <SendIcon className={styles.sendIcon} />
        </button>
      </form>
    </div>
  )
}
