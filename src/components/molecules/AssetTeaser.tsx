import React from 'react'
import { Link } from 'gatsby'
import Dotdotdot from 'react-dotdotdot'
import Price from '../atoms/Price'
import { DDO, BestPrice } from '@oceanprotocol/lib'
import removeMarkdown from 'remove-markdown'
import Publisher from '../atoms/Publisher'
import AssetType from '../atoms/AssetType'
import NetworkName from '../atoms/NetworkName'
import { useOcean } from '../../providers/Ocean'
import styles from './AssetTeaser.module.css'

declare type AssetTeaserProps = {
  ddo: any
  price: BestPrice
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({
  ddo,
  price
}: AssetTeaserProps) => {
  const { config } = useOcean()
  const { attributes } = ddo.findServiceByType('metadata')
  const { name, type } = attributes.main
  const { dataTokenInfo } = ddo
  const isCompute = Boolean(ddo?.findServiceByType('compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = ddo.publicKey[0]

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
          chainId={ddo.chainId}
        />

        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {removeMarkdown(
              attributes?.additionalInformation?.description || ''
            )}
          </Dotdotdot>
        </div>

        <footer className={styles.foot}>
          <Price price={price} small />
        </footer>
      </Link>
    </article>
  )
}

export default AssetTeaser
