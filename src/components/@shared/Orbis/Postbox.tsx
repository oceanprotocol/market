import React, { useRef, useState } from 'react'
import Button from '@shared/atoms/Button'
import styles from './Postbox.module.css'
import { useOrbis } from '@context/Orbis'

export default function Postbox({
  id,
  placeholder = 'Share your post here...',
  callbackPost
}: {
  placeholder: string
  id: string
  callbackPost: (post: OrbisPostInterface) => void
}) {
  const [post, setPost] = useState()

  const postBoxArea = useRef(null)
  const { orbis, account } = useOrbis()

  function handleInput(e: any) {
    setPost(e.currentTarget.innerText)
    const _keyCode = e.nativeEvent.data

    /** Manage custom actions for some keycodes */
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
      timestamp: Date.now()
    }
    // console.log(_callbackContent)
    callbackPost(_callbackContent)
    // console.log('clicked')
    const res = await orbis.createPost({ body: post, context: id })

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
        <div
          id="postbox-area"
          ref={postBoxArea}
          className={styles.editable}
          contentEditable={true}
          data-placeholder={placeholder}
          onInput={(e) => handleInput(e)}
        ></div>
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
