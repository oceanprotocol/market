import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import { MetadataMarket } from '../../@types/Metadata'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'

declare type AssetTeaserProps = {
  did: string
  metadata: MetadataMarket
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({
  did,
  metadata
}: AssetTeaserProps) => {
  if (!metadata.additionalInformation) return null

  const { name, price } = metadata.main
  const { description, access } = metadata.additionalInformation

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
        </div>

        <footer className={styles.foot}>
          <Price price={price} />
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
