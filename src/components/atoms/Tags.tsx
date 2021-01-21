import React from 'react'
import { Link } from 'gatsby'
import shortid from 'shortid'
import styles from './Tags.module.css'

declare type TagsProps = {
  items: string[]
  max?: number
  showMore?: boolean
  className?: string
  noLinks?: boolean
}

const Tag = ({ tag, noLinks }: { tag: string; noLinks?: boolean }) => {
  return noLinks ? (
    <span className={styles.tag}>{tag}</span>
  ) : (
    <Link
      to={`/search?tags=${tag}&sort=created&sortOrder=desc`}
      className={styles.tag}
      title={tag}
    >
      {tag}
    </Link>
  )
}

const Tags: React.FC<TagsProps> = ({
  items,
  max,
  showMore,
  className,
  noLinks
}) => {
  max = max || items.length
  const remainder = items.length - max
  // filter out empty array items, and restrict to `max`
  const tags = items.filter((tag) => tag !== '').slice(0, max)
  const shouldShowMore = showMore && remainder > 0
  const classes = className ? `${styles.tags} ${className}` : styles.tags

  return (
    <div className={classes}>
      {tags?.map((tag) => (
        <Tag tag={tag} noLinks={noLinks} key={shortid.generate()} />
      ))}
      {shouldShowMore && (
        <span className={styles.more}>{`+ ${items.length - max} more`}</span>
      )}
    </div>
  )
}

export default Tags
