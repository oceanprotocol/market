import React from 'react'
import { DDO } from '@oceanprotocol/squid'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import {
  AdditionalInformationDexFreight,
  MetaDataDexFreight
} from '../../@types/MetaData'
import { findServiceByType } from '../../utils'
import Tags from '../atoms/Tags'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'
import Rating from '../atoms/Rating'

declare type AssetTeaserProps = {
  ddo: Partial<DDO>
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({ ddo }: AssetTeaserProps) => {
  const { attributes } = findServiceByType(ddo, 'metadata')
  const { name, price } = attributes.main

  let description
  let copyrightHolder
  let tags
  let categories

  if (attributes && attributes.additionalInformation) {
    ;({
      description,
      copyrightHolder,
      tags,
      categories
    } = attributes.additionalInformation as AdditionalInformationDexFreight)
  }

  const { curation } = attributes as MetaDataDexFreight

  return (
    <article className={styles.teaser}>
      <Link href="/asset/[did]" as={`/asset/${ddo.id}`}>
        <a className={styles.link}>
          <h1 className={styles.title}>{name}</h1>
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
        </a>
      </Link>
    </article>
  )
}

export default AssetTeaser
