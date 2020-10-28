import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import { MetadataMarket } from '../../@types/MetaData'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'
import { DDO } from '@oceanprotocol/lib'
import removeMarkdown from 'remove-markdown'
import Tooltip from '../atoms/Tooltip'

declare type AssetTeaserProps = {
  ddo: DDO
  metadata: MetadataMarket
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({
  ddo,
  metadata
}: AssetTeaserProps) => {
  const { name } = metadata.main
  const { dataTokenInfo } = ddo
  const isCompute = Boolean(ddo.findServiceByType('compute'))

  return (
    <article className={styles.teaser}>
      <Link to={`/asset/${ddo.id}`} className={styles.link}>
        <Tooltip
          placement="left"
          content={dataTokenInfo?.name}
          className={styles.symbol}
        >
          {dataTokenInfo?.symbol}
        </Tooltip>
        <h1 className={styles.title}>{name}</h1>

        {isCompute && <div className={styles.accessLabel}>Compute</div>}

        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {removeMarkdown(metadata?.additionalInformation?.description || '')}
          </Dotdotdot>
        </div>

        <footer className={styles.foot}>
          <Price ddo={ddo} small />
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
