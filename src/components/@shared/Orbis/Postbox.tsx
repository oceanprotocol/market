import React, { useRef } from 'react'
import Button from '@shared/atoms/Button'
import styles from './Postbox.module.css'

export default function Postbox({
  placeholder = 'Share your post here...'
}: {
  placeholder: string
}) {
  const postBoxArea = useRef(null)

  // const handleInput = (e: Event): FormEvent<HTMLDivElement> => {
  //   e.preventDefault()
  //   console.log(e)
  // }
  return (
    <>
      <div className={styles.postbox}>
        <div
          id="postbox-area"
          ref={postBoxArea}
          className={styles.editable}
          contentEditable={true}
          data-placeholder={placeholder}
        ></div>
        <div className={styles.sendButtonWrap}>
          <Button style="primary" type="submit" size="small" disabled={false}>
            Send
          </Button>
        </div>
      </div>
    </>
  )
}
