import React, { ReactElement, useEffect, useState } from 'react'
import get3BoxProfile from '../../../../utils/profile'
import { Profile } from '../../../../models/Profile'
import { accountTruncate } from '../../../../utils/web3'
import axios from 'axios'
import PublisherLinks from './PublisherLinks'
import Markdown from '../../../atoms/Markdown'
import Stats from './Stats'
import Account from './Account'
import styles from './index.module.css'

const isDescriptionTextClamped = () => {
  const el = document.getElementById('description')
  if (el) return el.scrollHeight > el.clientHeight
}

const clearedProfile: Profile = {
  name: null,
  image: null,
  description: null,
  links: null
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
  const [profile, setProfile] = useState<Profile>({
    name: accountTruncate(accountId),
    image: null,
    description: null,
    links: null
  })
  const [isShowMore, setIsShowMore] = useState(false)

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  useEffect(() => {
    if (!accountId) {
      setProfile(clearedProfile)
      return
    }

    const source = axios.CancelToken.source()

    async function getInfoFrom3Box() {
      const profile3Box = await get3BoxProfile(accountId, source.token)
      if (profile3Box) {
        const { name, emoji, description, image, links } = profile3Box
        const newName = `${emoji || ''} ${name || accountTruncate(accountId)}`
        const newProfile = {
          name: newName,
          image,
          description,
          links
        }
        setProfile(newProfile)
      } else {
        setProfile(clearedProfile)
      }
    }
    getInfoFrom3Box()

    return () => {
      source.cancel()
    }
  }, [accountId])

  return (
    <div className={styles.grid}>
      <div>
        <Account
          accountId={accountId}
          image={profile.image}
          name={profile.name}
        />
        <Stats accountId={accountId} />
      </div>

      <div>
        <Markdown text={profile.description} className={styles.description} />
        {isDescriptionTextClamped() ? (
          <span className={styles.more} onClick={toogleShowMore}>
            <Link3Box accountId={accountId} text="Read more on 3box" />
          </span>
        ) : (
          ''
        )}
        {profile.links?.length > 0 && (
          <PublisherLinks
            links={profile.links}
            className={styles.publisherLinks}
          />
        )}
      </div>
      <div className={styles.meta}>
        Profile data from <Link3Box accountId={accountId} text="3Box Hub" />
      </div>
    </div>
  )
}
