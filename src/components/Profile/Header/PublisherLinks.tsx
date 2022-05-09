import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import External from '@images/external.svg'
import styles from './PublisherLinks.module.css'
import { useProfile } from '@context/Profile'

const cx = classNames.bind(styles)

function getLinkData(link: ProfileLink): { href: string; label: string } {
  let href, label

  switch (link.key) {
    case 'url':
      href = link.value
      label = 'Website'
      break
    case 'com.twitter':
      href = `https://twitter.com/${link.value}`
      label = 'Twitter'
      break
    case 'com.github':
      href = `https://github.com/${link.value}`
      label = 'GitHub'
      break
    case 'org.telegram':
      href = `https://telegram.org/${link.value}`
      label = 'Telegram'
      break
    case 'com.discord':
      href = `https://discordapp.com/users/${link.value}`
      label = 'Discord'
      break
    case 'com.reddit':
      href = `https://reddit.com/u/${link.value}`
      label = 'Reddit'
      break
  }

  return { href, label }
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
      {profile?.links?.map((link) => (
        <a
          href={getLinkData(link).href}
          key={link.key}
          target="_blank"
          rel="noreferrer"
        >
          {getLinkData(link).label}{' '}
          <External className={styles.linksExternal} />
        </a>
      ))}
    </div>
  )
}
