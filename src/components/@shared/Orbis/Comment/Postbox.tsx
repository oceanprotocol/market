import React, { useRef, useState, KeyboardEvent } from 'react'
import styles from './Postbox.module.css'
import { EmojiClickData } from 'emoji-picker-react'
import { useOrbis } from '@context/Orbis'
import Button from '@shared/atoms/Button'
import EmojiPicker from '../EmojiPicker'
import { accountTruncate } from '@utils/web3'
import { didToAddress } from '@utils/orbis'

export default function Postbox({
  context,
  placeholder = 'Share your post here...',
  replyTo = null,
  editPost = null,
  enterToSend = false,
  cancelReplyTo,
  callback
}: {
  context: string
  placeholder?: string
  replyTo?: IOrbisPost
  editPost?: IOrbisPost
  enterToSend?: boolean
  cancelReplyTo?: () => void
  callback: (value: any) => void
}) {
  const [focusOffset, setFocusOffset] = useState<number | undefined>()
  const [focusNode, setFocusNode] = useState<Node | undefined>()

  const postBoxArea = useRef(null)
  const { orbis, account } = useOrbis()

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
    if (!account) return false

    const body = postBoxArea.current.innerText

    // Cleaning up mentions
    // const _mentions = mentions.filter((o) => body.includes(o.username))

    if (editPost) {
      const newContent = { ...editPost.content, body }
      if (callback) callback(newContent)
      await orbis.editPost(editPost.stream_id, newContent)
    } else {
      const content = {
        body,
        context,
        master: replyTo ? replyTo.master || replyTo.stream_id : null,
        reply_to: replyTo ? replyTo.stream_id : null
        // mentions: _mentions || undefined
      }

      const timestamp = Math.floor(Date.now() / 1000)

      const _callbackContent = {
        content,
        context,
        creator: account.did,
        creator_details: {
          did: account.did,
          profile: account.details?.profile,
          metadata: account.details?.metadata
        },
        stream_id: 'new_post-' + timestamp,
        timestamp,
        master: replyTo ? replyTo.master || replyTo.stream_id : null,
        reply_to: replyTo ? replyTo.stream_id : null,
        reply_to_creator_details: replyTo ? replyTo.creator_details : null,
        reply_to_details: replyTo ? replyTo.content : null,
        count_commits: 1,
        count_likes: 0,
        count_haha: 0,
        count_downvotes: 0,
        count_replies: 0,
        type: replyTo ? 'reply' : null
      }

      console.log(_callbackContent)

      callback(_callbackContent)
      postBoxArea.current.innerText = ''

      const res = await orbis.createPost(content)

      if (res.status === 200) {
        _callbackContent.stream_id = res.doc
        if (callback) callback(_callbackContent)
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.key) return

    if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
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
            <br />
            {replyTo.content?.body}
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
          data-placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onKeyUp={saveCaretPos}
          onMouseUp={saveCaretPos}
        />
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </div>
      <div className={styles.sendButtonWrap}>
        <Button
          style="primary"
          type="submit"
          size="small"
          disabled={false}
          onClick={share}
        >
          Send
        </Button>
      </div>
    </div>
  )
}
