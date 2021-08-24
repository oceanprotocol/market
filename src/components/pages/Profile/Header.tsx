import React, { ReactElement, useEffect, useState } from 'react'
import get3BoxProfile from '../../../utils/profile'
import { ProfileLink } from '../../../models/Profile'
import { accountTruncate } from '../../../utils/web3'
import axios from 'axios'
import PublisherLinks from '../../atoms/Publisher/PublisherLinks'
import Stats from './Stats'
import Account from './Account'
import styles from './Header.module.css'

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const [image, setImage] = useState<string>()
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()

  const [links, setLinks] = useState<ProfileLink[]>()

  const [isReadMore, setIsReadMore] = useState(true)
  const [isShowMore, setIsShowMore] = useState(false)

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  const isDescriptionTextClamped = () => {
    const el = document.getElementById('description')
    if (el) return el.scrollHeight > el.clientHeight
  }

  useEffect(() => {
    if (!accountId) return

    const source = axios.CancelToken.source()

    async function getInfoFrom3Box() {
      const profile = await get3BoxProfile(accountId, source.token)
      if (profile) {
        const { name, emoji, description, image, links } = profile
        setName(`${emoji || ''} ${name || accountTruncate(accountId)}`)
        setDescription(description || null)
        setImage(image || null)
        setLinks(links || [])
      } else {
        setName(accountTruncate(accountId))
        setDescription(null)
        setImage(null)
        setLinks([])
      }
    }
    getInfoFrom3Box()

    return () => {
      source.cancel()
    }
  }, [accountId])

  return (
    <div>
      {accountId ? (
        <div className={styles.grid}>
          <div>
            <Account image={image} name={name} />
            <Stats accountId={accountId} />
          </div>

          <div>
            <p id="description" className={styles.description}>
              {description || 'No description found.'}
            </p>
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
      ) : (
        ''
      )}
    </div>
  )
}
