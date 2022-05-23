import React, { ReactElement } from 'react'
import Link from 'next/link'
import styles from './index.module.css'

export interface TagsProps {
  items: string[]
  max?: number
  showMore?: boolean
  className?: string
  noLinks?: boolean
}

const Tag = ({ tag, noLinks }: { tag: string; noLinks?: boolean }) => {
  const urlEncodedTag = encodeURIComponent(tag)
  return noLinks ? (
    <span className={styles.tag}>{tag}</span>
  ) : (
    <Link
      href={`/search?tags=${urlEncodedTag}&sort=metadata.created&sortOrder=desc`}
    >
      <a className={styles.tag} title={tag}>
        {tag}
      </a>
    </Link>
  )
}

export default function Tags({
  items,
  max,
  showMore,
  className,
  noLinks
}: TagsProps): ReactElement {
  max = max || items.length
  const remainder = items.length - max
  // filter out empty array items, and restrict to `max`
  const tags = items.filter((tag) => tag !== '').slice(0, max)
  const shouldShowMore = showMore && remainder > 0
  const classes = className ? `${styles.tags} ${className}` : styles.tags

  return (
    <div className={classes}>
      {tags?.map((tag, i) => (
        <Tag tag={tag} noLinks={noLinks} key={tag + i} />
      ))}
      {shouldShowMore && (
        <span className={styles.more}>{`+ ${items.length - max} more`}</span>
      )}
    </div>
  )
}
