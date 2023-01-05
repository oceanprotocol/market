import React, { ReactElement } from 'react'
import { toast } from 'react-toastify'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './Share.module.css'
import Button from '@shared/atoms/Button'
import ShareIcon from '@images/share.svg'

export default function Share({
  accountId
}: {
  accountId: string
}): ReactElement {
  function copyLink() {
    navigator.clipboard.writeText(
      window.location.origin + '/profile/' + accountId
    )
    toast.success('Profile link copied to clipboard')
  }
  return (
    <div className={styles.share}>
      <Button
        className={styles.button}
        onClick={copyLink}
        style="text"
        size="small"
      >
        <ShareIcon role="img" aria-label="Share" className={styles.icon} />
        Share
      </Button>
      <Tooltip
        content={`Copy the link to this profile to share it with others.`}
      />
    </div>
  )
}
