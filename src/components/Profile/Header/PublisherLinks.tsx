import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import External from '@images/external.svg'
import styles from './PublisherLinks.module.css'
import { useProfile } from '@context/Profile'

const cx = classNames.bind(styles)

function getLinkHref(link: ProfileLink): string {
  let href

  switch (link.name) {
    case 'Twitter':
      href = `https://twitter.com/${link.value}`
      break
    case 'GitHub':
      href = `https://github.com/${link.value}`
      break
    case 'Telegram':
      href = `https://telegram.org/${link.value}`
      break
    case 'Discord':
      href = `https://discordapp.com/users/${link.value}`
      break
    case 'Reddit':
      href = `https://reddit.com/u/${link.value}`
      break
  }

  return href
}

export default function PublisherLinks({
  className
}: {
  className: string
}): ReactElement {
  const { profile } = useProfile()

  const styleClasses = cx({
    links: true,
    [className]: className
  })

  return (
    <div className={styleClasses}>
      {' — '}
      {profile?.url && (
        <a href={profile?.url} target="_blank" rel="noreferrer">
          Website <External className={styles.linksExternal} />
        </a>
      )}
      {profile?.links?.map((link) => {
        return (
          <a
            href={getLinkHref(link)}
            key={link.name}
            target="_blank"
            rel="noreferrer"
          >
            {link.name} <External className={styles.linksExternal} />
          </a>
        )
      })}
    </div>
  )
}
