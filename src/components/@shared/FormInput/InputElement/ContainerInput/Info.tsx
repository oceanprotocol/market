import React, { ReactElement } from 'react'
import styles from './Info.module.css'

export default function ImageInfo({
  image,
  tag,
  valid,
  handleClose
}: {
  image: string
  tag: string
  valid: boolean
  handleClose(): void
}): ReactElement {
  const displayText = valid
    ? '✓ Image found, container checksum automatically added!'
    : 'x Container checksum could not be fetched automatically, please add it manually'
  return (
    <div className={styles.info}>
      <h3 className={styles.contianer}>{`Image: ${image} Tag: ${tag}`}</h3>
      <ul>
        <li className={valid ? styles.success : styles.error}>{displayText}</li>
      </ul>
      <button className={styles.removeButton} onClick={handleClose}>
        &times;
      </button>
    </div>
  )
}
