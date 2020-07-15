import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import { MetaDataMarket } from '../../@types/MetaData'
import Tags from '../atoms/Tags'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'

declare type AssetTeaserProps = {
  did: string
  metadata: MetaDataMarket
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({
  did,
  metadata
}: AssetTeaserProps) => {
  const { name, price } = metadata.main

  const {
    description,
    copyrightHolder,
    tags,
    categories,
    access
  } = metadata.additionalInformation

  return (
    <article className={styles.teaser}>
      <Link to={`/asset/${did}`} className={styles.link}>
        <h1 className={styles.title}>{name}</h1>
        {access === 'Compute' && (
          <div className={styles.accessLabel}>{access}</div>
        )}

        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {description || ''}
          </Dotdotdot>

          {tags && (
            <Tags className={styles.tags} items={tags} max={3} noLinks />
          )}
        </div>

        <footer className={styles.foot}>
          <Price price={price} small />
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
