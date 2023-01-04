import React, { ReactElement } from 'react'
import styles from './Share.module.css'
import Button from '@shared/atoms/Button'

export default function Share({
  accountId
}: {
  accountId: string
}): ReactElement {
  function copyLink() {
    navigator.clipboard.writeText(window.location.href + '/' + accountId)
  }
  return (
    <div className={styles.share}>
      <Button className={styles.button} onClick={copyLink} style="text">
        Share
      </Button>
    </div>
  )
}
