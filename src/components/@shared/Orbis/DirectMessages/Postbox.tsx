import React, { useRef, useState, KeyboardEvent } from 'react'
import styles from './Postbox.module.css'
import { EmojiClickData } from 'emoji-picker-react'
import { useOrbis } from '@context/Orbis'
import EmojiPicker from '../EmojiPicker'
import { accountTruncate } from '@utils/web3'
import { didToAddress, sleep } from '@utils/orbis'

export default function Postbox({
  replyTo = null,
  cancelReplyTo,
  callback
}: {
  replyTo?: IOrbisMessage
  cancelReplyTo?: () => void
  callback: (value: IOrbisMessage) => void
}) {
  const [focusOffset, setFocusOffset] = useState<number | undefined>()
  const [focusNode, setFocusNode] = useState<Node | undefined>()
  const [isSending, setIsSending] = useState<boolean>(false)

  const postBoxArea = useRef(null)
  const {
    orbis,
    account,
    conversationId,
    newConversation,
    createConversation,
    setConversationId,
    setNewConversation
  } = useOrbis()

  const saveCaretPos = () => {
    const sel = document.getSelection()
    if (sel) {
      setFocusOffset(sel.focusOffset)
      setFocusNode(sel.focusNode)
    }
  }

  const restoreCaretPos = () => {
    postBoxArea.current.focus()
    const sel = document.getSelection()
    sel.collapse(focusNode, focusOffset)
  }

  const share = async () => {
    if (!account || isSending) return false

    setIsSending(true)

    let _conversationId = conversationId
    if (_conversationId.startsWith('new-') && newConversation) {
      const _newConversation = await createConversation(
        newConversation.recipients
      )
      if (_newConversation) {
        _conversationId = _newConversation.stream_id
        setConversationId(_conversationId)
        setNewConversation(null)
        await sleep(1000)
      }
    }

    const body = postBoxArea.current.innerText

    const content: IOrbisMessageContent & { decryptedMessage?: string } = {
      encryptedMessage: null,
      decryptedMessage: body,
      master: replyTo ? replyTo.master || replyTo.stream_id : undefined,
      reply_to: replyTo ? replyTo.stream_id : undefined
    }

    const timestamp = Math.floor(Date.now() / 1000)

    const _callbackContent: IOrbisMessage = {
      conversation_id: conversationId,
      content,
      creator: account.did,
      creator_details: {
        did: account.did,
        profile: account.details?.profile,
        metadata: account.details?.metadata
      },
      master: replyTo ? replyTo.master || replyTo.stream_id : null,
      reply_to: replyTo ? replyTo.stream_id : null,
      reply_to_creator_details: replyTo ? replyTo.creator_details : null,
      reply_to_details: replyTo ? replyTo.content : null,
      stream_id: 'new_post--' + timestamp,
      timestamp
    }

    if (callback) callback(_callbackContent)
    postBoxArea.current.innerText = ''

    const res = await orbis.sendMessage({
      conversation_id: _conversationId,
      body
    })

    if (res.status === 200) {
      _callbackContent.stream_id = res.doc
      if (callback) callback(_callbackContent)
    }

    setIsSending(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.key) return

    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      // Don't generate a new line
      e.preventDefault()
      share()
    }
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    if (focusOffset === undefined || focusNode === undefined) {
      postBoxArea.current.innerText += emojiData.emoji
    } else {
      restoreCaretPos()
      document.execCommand('insertHTML', false, emojiData.emoji)
    }
  }

  return (
    <div className={styles.postbox}>
      {replyTo && (
        <div className={styles.replyto}>
          <div className={styles.replytoDetails}>
            Replying to{' '}
            <strong>
              {replyTo?.creator_details?.metadata?.ensName ||
                accountTruncate(didToAddress(replyTo?.creator_details?.did))}
            </strong>
          </div>
          <button className={styles.replytoCancel} onClick={cancelReplyTo}>
            &times;
          </button>
        </div>
      )}
      <div className={styles.postboxInput}>
        <div
          id="postbox-area"
          ref={postBoxArea}
          className={styles.editable}
          contentEditable={true}
          data-placeholder="Type your message here..."
          onKeyDown={handleKeyDown}
          onKeyUp={saveCaretPos}
          onMouseUp={saveCaretPos}
        />
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </div>
    </div>
  )
}
