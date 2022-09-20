import React, { ReactElement } from 'react'
import styles from './Info.module.css'

export default function ImageInfo({
  image,
  tag,
  handleClose
}: {
  image: string
  tag: string
  handleClose(): void
}): ReactElement {
  return (
    <div className={styles.info}>
      <h3 className={styles.url}>{`${image}:${tag}`}</h3>
      <ul>
        <li className={styles.success}>✓ Image found</li>
      </ul>
      <button className={styles.removeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  )
}
