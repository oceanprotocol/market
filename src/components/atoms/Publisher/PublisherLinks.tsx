import React, { ReactElement } from 'react'
import styles from './PublisherLinks.module.css'
import { ProfileLink } from '../../../models/Profile'
import { ReactComponent as External } from '../../../images/external.svg'

export default function PublisherLinks({
  links
}: {
  links: ProfileLink[]
}): ReactElement {
  return (
    <div className={styles.links}>
      {' — '}
      {links?.map((link: ProfileLink) => {
        const href =
          link.name === 'Twitter'
            ? `https://twitter.com/${link.value}`
            : link.name === 'GitHub'
            ? `https://github.com/${link.value}`
            : link.value.includes('http') // safeguard against urls without protocol defined
            ? link.value
            : `//${link.value}`

        return (
          <a href={href} key={link.name} target="_blank" rel="noreferrer">
            {link.name} <External className={styles.linksExternal} />
          </a>
        )
      })}
    </div>
  )
}
