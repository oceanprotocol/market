import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'
import { DDO } from '@oceanprotocol/lib'
import removeMarkdown from 'remove-markdown'
import Publisher from '../atoms/Publisher'
import { useMetadata } from '@oceanprotocol/react'
import Time from '../atoms/Time'
import AssetType from '../atoms/AssetType'

declare type AssetTeaserProps = {
  ddo: DDO
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({ ddo }: AssetTeaserProps) => {
  const { owner } = useMetadata(ddo)
  const { attributes } = ddo.findServiceByType('metadata')
  const { name, type } = attributes.main
  const { dataTokenInfo } = ddo
  const accessType = ddo.service[1].type

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link to={`/asset/${ddo.id}`} className={styles.link}>
        <header className={styles.header}>
          <div className={styles.symbol}>{dataTokenInfo?.symbol}</div>
          <Dotdotdot clamp={3}>
            <h1 className={styles.title}>{name}</h1>
          </Dotdotdot>
          <Publisher account={owner} minimal className={styles.publisher} />
        </header>

        <AssetType
          type={type}
          accessType={accessType}
          className={styles.typeDetails}
        />

        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {removeMarkdown(
              attributes?.additionalInformation?.description || ''
            )}
          </Dotdotdot>
        </div>

        <footer className={styles.foot}>
          <Price ddo={ddo} small />
          <p className={styles.date}>
            <Time date={ddo?.created} relative />
          </p>
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
