import React, { ReactElement, useState } from 'react'
import PublisherLinks from './PublisherLinks'
import Markdown from '../../../atoms/Markdown'
import Stats from './Stats'
import Account from './Account'
import styles from './index.module.css'
import { useProfile } from '../../../../providers/Profile'

const isDescriptionTextClamped = () => {
  const el = document.getElementById('description')
  if (el) return el.scrollHeight > el.clientHeight
}

const Link3Box = ({ accountId, text }: { accountId: string; text: string }) => {
  return (
    <a
      href={`https://www.3box.io/${accountId}`}
      target="_blank"
      rel="noreferrer"
    >
      {text}
    </a>
  )
}

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { profile } = useProfile()
  const [isShowMore, setIsShowMore] = useState(false)

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  return (
    <div className={styles.grid}>
      <div>
        <Account accountId={accountId} />
        <Stats accountId={accountId} />
      </div>

      <div>
        <Markdown text={profile?.description} className={styles.description} />
        {isDescriptionTextClamped() ? (
          <span className={styles.more} onClick={toogleShowMore}>
            <Link3Box accountId={accountId} text="Read more on 3box" />
          </span>
        ) : (
          ''
        )}
        {profile?.links?.length > 0 && (
          <PublisherLinks className={styles.publisherLinks} />
        )}
      </div>
      <div className={styles.meta}>
        Profile data from <Link3Box accountId={accountId} text="3Box Hub" />
      </div>
    </div>
  )
}
