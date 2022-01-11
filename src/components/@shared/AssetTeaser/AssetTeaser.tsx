import React, { ReactElement } from 'react'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import Price from '@shared/Price'
import removeMarkdown from 'remove-markdown'
import Publisher from '@shared/Publisher'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './AssetTeaser.module.css'
import { getServiceByName } from '@utils/ddo'
import { Asset } from '@oceanprotocol/lib'

declare type AssetTeaserProps = {
  ddo: Asset
  price: BestPrice
  noPublisher?: boolean
}

export default function AssetTeaser({
  ddo,
  price,
  noPublisher
}: AssetTeaserProps): ReactElement {
  const { name, type, description } = ddo.metadata
  const { datatokens } = ddo
  const isCompute = Boolean(getServiceByName(ddo, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = ddo.nft

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link href={`/asset/${ddo.id}`}>
        <a className={styles.link}>
          <header className={styles.header}>
            <div className={styles.symbol}>{datatokens[0]?.symbol}</div>
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
              {removeMarkdown(description?.substring(0, 300) || '')}
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
