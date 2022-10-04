import React, { useRef, useState } from 'react'
import Button from '@shared/atoms/Button'
import styles from './Postbox.module.css'
import { useOrbis } from '@context/Orbis'

export default function Postbox({
  id,
  placeholder = 'Share your post here...'
}: {
  placeholder: string
  id: string
}) {
  const [post, setPost] = useState()

  const postBoxArea = useRef(null)
  const { orbis } = useOrbis()

  function handleInput(e) {
    setPost(e.currentTarget.innerText)
    const _keyCode = e.nativeEvent.data

    /** Manage custom actions for some keycodes */
  }

  const createPost = async () => {
    console.log('clicked')
    const res = await orbis.createPost({ body: post, context: id })

    if (res.status === 200) {
      console.log('success with,', res)
      setPost(null)
      if (postBoxArea.current) {
        postBoxArea.current.textContent = ''
        postBoxArea.current.focus()
      }
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
