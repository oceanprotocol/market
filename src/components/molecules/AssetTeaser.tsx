import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'
import { DDO } from '@oceanprotocol/lib'
import removeMarkdown from 'remove-markdown'
import Tooltip from '../atoms/Tooltip'
import { useMetadata } from '@oceanprotocol/react'
import Partner from '../atoms/Partner'
import { useDataPartner } from '../../hooks/useDataPartner'

declare type AssetTeaserProps = {
  ddo: DDO
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({ ddo }: AssetTeaserProps) => {
  const { owner } = useMetadata(ddo)
  const { partner } = useDataPartner(owner)

  const { attributes } = ddo.findServiceByType('metadata')
  const { name } = attributes.main
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
        {partner && <Partner className={styles.partner} partner={partner} />}
        {isCompute && <div className={styles.accessLabel}>Compute</div>}

        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {removeMarkdown(
              attributes?.additionalInformation?.description || ''
            )}
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
