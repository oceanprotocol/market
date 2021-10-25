import React from 'react'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import Price from '@shared/Price'
import { DDO } from '@oceanprotocol/lib'
import removeMarkdown from 'remove-markdown'
import Publisher from '@shared/Publisher'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './AssetTeaser.module.css'

declare type AssetTeaserProps = {
  ddo: DDO
  price: BestPrice
  noPublisher?: boolean
}

const AssetTeaser: React.FC<AssetTeaserProps> = ({
  ddo,
  price,
  noPublisher
}: AssetTeaserProps) => {
  const { attributes } = ddo.findServiceByType('metadata')
  const { name, type } = attributes.main
  const { dataTokenInfo } = ddo
  const isCompute = Boolean(ddo?.findServiceByType('compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = ddo.publicKey[0]

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link href={`/asset/${ddo.id}`}>
        <a className={styles.link}>
          <header className={styles.header}>
            <div className={styles.symbol}>{dataTokenInfo?.symbol}</div>
            <Dotdotdot clamp={3}>
              <h1 className={styles.title}>{name}</h1>
            </Dotdotdot>
            {!noPublisher && (
              <Publisher account={owner} minimal className={styles.publisher} />
            )}
          </header>

          <AssetType
            type={type}
            accessType={accessType}
            className={styles.typeDetails}
          />

          <div className={styles.content}>
            <Dotdotdot tagName="p" clamp={3}>
              {removeMarkdown(
                attributes?.additionalInformation?.description?.substring(
                  0,
                  300
                ) || ''
              )}
            </Dotdotdot>
          </div>

          <footer className={styles.foot}>
            <Price price={price} small />
            <NetworkName networkId={ddo.chainId} className={styles.network} />
          </footer>
        </a>
      </Link>
    </article>
  )
}

export default AssetTeaser
