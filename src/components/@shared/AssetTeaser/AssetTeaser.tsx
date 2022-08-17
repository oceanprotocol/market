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
import { AssetExtended } from 'src/@types/AssetExtended'
import contentAsset from '../../../../content/settings/assets.json'
import PolygonIcon from '@images/polygon.svg'

declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
}

export default function AssetTeaser({
  asset,
  noPublisher
}: AssetTeaserProps): ReactElement {
  const { name, type, description } = asset.metadata
  const { datatokens } = asset
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft

  const itemsOpen = Object.values(contentAsset).map((value) => {
    return value.source
  })

  return (
    <>
      <article className={`${styles.teaser} ${styles[type]}`}>
        <div>
          <Link href={`/asset/${asset.id}`}>
            <a className={styles.link}>
              <header className={styles.header}>
                <div className={styles.symbol}>{datatokens[0]?.symbol}</div>
                <Dotdotdot clamp={3}>
                  <h1 className={styles.title}>{name}</h1>
                </Dotdotdot>
                {!noPublisher && (
                  <Publisher
                    account={owner}
                    minimal
                    className={styles.publisher}
                  />
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
                <Price accessDetails={asset.accessDetails} size="small" />
                <NetworkName
                  networkId={asset.chainId}
                  className={styles.network}
                />
              </footer>
            </a>
          </Link>
        </div>
        <div>
          <Link href={`/asset/${asset.id}`}>
            <a className={styles.signal}>
              <div className={styles.symbol2}>
                <PolygonIcon className={styles.icon} /> <div>88.4%</div>
              </div>

              <div className={styles.symbol2}>39%</div>
              <div className={styles.symbol2}>4</div>
            </a>
          </Link>
        </div>
      </article>
    </>
  )
}
