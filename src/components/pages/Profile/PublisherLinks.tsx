import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import { ProfileLink } from '../../../models/Profile'
import { ReactComponent as External } from '../../../images/external.svg'
import styles from './PublisherLinks.module.css'

const cx = classNames.bind(styles)

export default function PublisherLinks({
  links,
  className
}: {
  links: ProfileLink[]
  className: string
}): ReactElement {
  const styleClasses = cx({
    links: true,
    [className]: className
  })

  return (
    <div className={styleClasses}>
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
