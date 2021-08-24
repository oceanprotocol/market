import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AccountHeader.module.css'
import get3BoxProfile from '../../../utils/profile'
import { ProfileLink } from '../../../models/Profile'
import { accountTruncate } from '../../../utils/web3'
import axios from 'axios'
import ExplorerLink from '../../atoms/ExplorerLink'
import PublisherLinks from '../../atoms/Publisher/PublisherLinks'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { getOceanConfig } from '../../../utils/ocean'
import { toDataUrl } from 'ethereum-blockies'
import Stats from './Stats'

const Blockies = ({ account }: { account: string | undefined }) => {
  if (!account) return null
  const blockies = toDataUrl(account)

  return (
    <img
      className={styles.image}
      src={blockies}
      alt="Blockies"
      aria-hidden="true"
    />
  )
}

export default function AccountHeader({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [image, setImage] = useState<string>()
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
            <div className={styles.profileInfoGrid}>
              {image ? (
                <img
                  src={image}
                  className={styles.image}
                  width="48"
                  height="48"
                />
              ) : (
                <Blockies account={accountId} />
              )}
              <div>
                <h3 className={styles.name}>
                  {name || accountTruncate(accountId)}
                </h3>
                {chainIds.map((value, index) => {
                  const oceanConfig = getOceanConfig(value)
                  if (!isShowMore && index > 0) return
                  return (
                    <ExplorerLink
                      className={styles.truncate}
                      networkId={value}
                      path={`address/${accountId}`}
                      key={value}
                    >
                      <code>
                        {accountTruncate(accountId)} on{' '}
                        {oceanConfig?.explorerUri}
                      </code>
                    </ExplorerLink>
                  )
                })}
                {chainIds.length > 1 ? (
                  <span className={styles.more} onClick={toogleShowMore}>
                    {!isShowMore
                      ? `Show ${chainIds.length - 1} more`
                      : 'Show less'}
                  </span>
                ) : (
                  ''
                )}
              </div>
            </div>

            <Stats />
          </div>

          <div>
            <p className={styles.descriptionLabel}>About</p>
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
                    Read more
                  </a>
                </span>
              ) : (
                ''
              )}
            </div>
            {links?.length > 0 && (
              <div className={styles.publisherLinks}>
                <PublisherLinks links={links} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>
          Please connect your Web3 wallet or add a valid publisher identifier in
          the url.
        </p>
      )}
    </div>
  )
}
