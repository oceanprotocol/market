import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as External } from '../../../../images/external.svg'
import styles from './PublisherLinks.module.css'
import { useProfile } from '../../../../providers/Profile'

const cx = classNames.bind(styles)

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
      {profile?.links?.map((link) => {
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
