import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import { MetaDataMarket } from '../../@types/MetaData'
import Tags from '../atoms/Tags'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'
import Rating from '../atoms/Rating'

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

  const { curation } = metadata

  return (
    <article className={styles.teaser}>
      <Link to={`/asset/${did}`} className={styles.link}>
        <h1 className={styles.title}>{name}</h1>
        {access === 'Compute' && (
          <div className={styles.accessLabel}>{access}</div>
        )}
        <Rating curation={curation} readonly />

        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {description || ''}
          </Dotdotdot>

          {tags && (
            <Tags className={styles.tags} items={tags} max={3} noLinks />
          )}
        </div>

        <footer className={styles.foot}>
          {categories && <p className={styles.type}>{categories[0]}</p>}

          <Price price={price} className={styles.price} />

          <p className={styles.copyright}>
            Provided by <strong>{copyrightHolder}</strong>
          </p>
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
