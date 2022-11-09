import React from 'react'
import EmojiIcon from '@images/emoji.svg'
import Picker, { EmojiStyle, Theme, EmojiClickData } from 'emoji-picker-react'
import styles from './EmojiPicker.module.css'
import useDarkMode from '@oceanprotocol/use-dark-mode'
import { useMarketMetadata } from '@context/MarketMetadata'
import Tooltip from '@shared/atoms/Tooltip'

export default function EmojiPicker({
  onEmojiClick
}: {
  onEmojiClick: (emojiData: EmojiClickData) => void
}) {
  const { appConfig } = useMarketMetadata()
  const darkMode = useDarkMode(false, appConfig?.darkModeConfig)

  return (
    <Tooltip
      content={
        <Picker
          onEmojiClick={onEmojiClick}
          theme={darkMode.value ? Theme.DARK : Theme.LIGHT}
          emojiStyle={EmojiStyle.NATIVE}
          autoFocusSearch={false}
          lazyLoadEmojis={true}
          width={322}
          height={399}
        />
      }
      trigger="click focus"
      zIndex={21}
      placement={'top-end'}
      className={styles.emojiToolTip}
    >
      <EmojiIcon className={styles.icon} />
    </Tooltip>
  )
}
