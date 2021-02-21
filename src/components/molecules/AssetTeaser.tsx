import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import Price from '../atoms/Price'
import styles from './AssetTeaser.module.css'
import { DDO } from '@oceanprotocol/lib'
import removeMarkdown from 'remove-markdown'
import Tooltip from '../atoms/Tooltip'
import Publisher from '../atoms/Publisher'
import { useMetadata } from '@oceanprotocol/react'
import Time from '../atoms/Time'
import { ReactComponent as Compute } from '../../images/compute.svg'
import { ReactComponent as Download } from '../../images/download.svg'

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
          <Tooltip
            placement="left"
            content={dataTokenInfo?.name}
            className={styles.symbol}
          >
            {dataTokenInfo?.symbol}
          </Tooltip>
          <Dotdotdot clamp={3}>
            <h1 className={styles.title}>{name}</h1>
          </Dotdotdot>
          <Publisher account={owner} minimal className={styles.publisher} />
        </header>

        <div className={styles.typeDetails}>
          <Tooltip
            content={
              accessType === 'access' ? 'Download data set' : 'Compute data set'
            }
          >
            {accessType === 'access' ? (
              <Download className={styles.icon} />
            ) : (
              <Compute className={styles.icon} />
            )}
          </Tooltip>
          <div className={styles.typeLabel}>{type}</div>
        </div>

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
