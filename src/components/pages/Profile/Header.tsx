import React, { ReactElement, useEffect, useState } from 'react'
import get3BoxProfile from '../../../utils/profile'
import { ProfileLink } from '../../../models/Profile'
import { accountTruncate } from '../../../utils/web3'
import axios from 'axios'
import PublisherLinks from '../../atoms/Publisher/PublisherLinks'
import Markdown from '../../atoms/Markdown'
import Stats from './Stats'
import Account from './Account'
import styles from './Header.module.css'

const isDescriptionTextClamped = () => {
  const el = document.getElementById('description')
  if (el) return el.scrollHeight > el.clientHeight
}

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const [image, setImage] = useState<string>()
  const [name, setName] = useState(accountTruncate(accountId))
  const [description, setDescription] = useState<string>()
  const [links, setLinks] = useState<ProfileLink[]>()
  const [isShowMore, setIsShowMore] = useState(false)

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  useEffect(() => {
    if (!accountId) {
      setName(null)
      setDescription(null)
      setImage(null)
      setLinks([])
      return
    }

    const source = axios.CancelToken.source()

    async function getInfoFrom3Box() {
      const profile = await get3BoxProfile(accountId, source.token)
      if (profile) {
        const { name, emoji, description, image, links } = profile
        setName(`${emoji || ''} ${name || accountTruncate(accountId)}`)
        setDescription(description || null)
        setImage(image || null)
        setLinks(links || [])
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
        <Account accountId={accountId} image={image} name={name} />
        <Stats accountId={accountId} />
      </div>

      <div>
        <Markdown
          text={
            description ||
            'No description found on [3box](https://3box.io/login).'
          }
          className={styles.description}
        />
        {isDescriptionTextClamped() ? (
          <span className={styles.more} onClick={toogleShowMore}>
            <a
              href={`https://www.3box.io/${accountId}`}
              target="_blank"
              rel="noreferrer"
            >
              Read more on 3box
            </a>
          </span>
        ) : (
          ''
        )}
        {links?.length > 0 && (
          <div className={styles.publisherLinks}>
            <PublisherLinks links={links} />
          </div>
        )}
      </div>
    </div>
  )
}
