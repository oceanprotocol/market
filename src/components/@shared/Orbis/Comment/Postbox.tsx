import React, { useRef, useState } from 'react'
import Button from '@shared/atoms/Button'
import styles from './Postbox.module.css'
import { useOrbis } from '@context/Orbis'
import EmojiPicker from '../EmojiPicker'
import { EmojiClickData } from 'emoji-picker-react'

export default function Postbox({
  assetId,
  placeholder = 'Share your post here...',
  callbackPost
}: {
  placeholder: string
  assetId: string
  callbackPost: (post: OrbisPostInterface) => void
}) {
  const [post, setPost] = useState('')
  const [focusOffset, setFocusOffset] = useState(null)
  const [focusNode, setFocusNode] = useState(null)

  const postBoxArea = useRef(null)
  const { orbis, account } = useOrbis()

  const saveCaretPos = (_sel: any) => {
    setFocusOffset(_sel.focusOffset)
    setFocusNode(_sel.focusNode)
  }

  const restoreCaretPos = () => {
    postBoxArea.current.focus()
    const sel = document.getSelection()
    sel.collapse(focusNode, focusOffset)
  }

  const handleInput = (e: any) => {
    setPost(e.currentTarget.innerText)
    saveCaretPos(document.getSelection())
  }

  const onEmojiClick = (emojiData: EmojiClickData) => {
    restoreCaretPos()
    document.execCommand('insertHTML', false, emojiData.emoji)
    // setPost((prevInput) => prevInput + emojiData.emoji)
    // postBoxArea.current.innerText += emojiData.emoji
  }

  const createPost = async () => {
    // console.log(post)
    const _callbackContent: OrbisPostInterface = {
      creator: account.did,
      creator_details: {
        did: account.did,
        profile: account.profile
      },
      stream_id: null,
      content: {
        body: post
      },
      timestamp: Math.floor(Date.now() / 1000),
      count_replies: 0,
      count_likes: 0,
      count_downvotes: 0,
      count_haha: 0
    }
    console.log(_callbackContent)
    callbackPost(_callbackContent)

    const res = await orbis.createPost({ body: post, context: assetId })

    if (res.status === 200) {
      console.log('success with,', res)
      setPost(null)
      if (postBoxArea.current) {
        postBoxArea.current.textContent = ''
        postBoxArea.current.focus()
      }

      setTimeout(async () => {
        const { data, error } = await orbis.getPost(res.doc)
        console.log(data)
        if (data) {
          callbackPost(data)
        }
        if (error) {
          console.log(error)
        }
      }, 2000)
    }
  }

  return (
    <>
      <div className={styles.postbox}>
        <div className={styles.postboxInput}>
          <div
            id="postbox-area"
            ref={postBoxArea}
            className={styles.editable}
            contentEditable={true}
            data-placeholder={placeholder}
            onInput={handleInput}
          />
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
        <div className={styles.sendButtonWrap}>
          <Button
            style="primary"
            type="submit"
            size="small"
            disabled={false}
            onClick={createPost}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  )
}
