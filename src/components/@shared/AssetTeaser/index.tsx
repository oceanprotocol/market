import React, { ReactElement } from 'react'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import Price from '@shared/Price'
import removeMarkdown from 'remove-markdown'
import Publisher from '@shared/Publisher'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './index.module.css'
import { getServiceByName } from '@utils/ddo'
import { useUserPreferences } from '@context/UserPreferences'
import { formatNumber } from '@utils/numbers'

export declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
  noDescription?: boolean
  noPrice?: boolean
}

export default function AssetTeaser({
  asset,
  noPublisher,
  noDescription
}: AssetTeaserProps): ReactElement {
  const { name, type, description } = asset.metadata
  const { datatokens } = asset
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft
  const { orders, allocated, price } = asset.stats
  const isUnsupportedPricing =
    !asset.services.length ||
    asset?.stats?.price?.value === undefined ||
    asset?.accessDetails?.type === 'NOT_SUPPORTED'
  const { locale } = useUserPreferences()

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link href={`/asset/${asset.id}`} className={styles.link}>
        <aside className={styles.detailLine}>
          <AssetType
            className={styles.typeLabel}
            type={type}
            accessType={accessType}
          />
          <span className={styles.typeLabel}>
            {datatokens[0]?.symbol.substring(0, 9)}
          </span>
          <NetworkName networkId={asset.chainId} className={styles.typeLabel} />
        </aside>
        <header className={styles.header}>
          <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
            {name.slice(0, 200)}
          </Dotdotdot>
          {!noPublisher && <Publisher account={owner} minimal />}
        </header>
        {!noDescription && (
          <div className={styles.content}>
            <Dotdotdot tagName="p" clamp={3}>
              {removeMarkdown(description?.substring(0, 300) || '')}
            </Dotdotdot>
          </div>
        )}
        <div className={styles.price}>
          {isUnsupportedPricing ? (
            <strong>No pricing schema available</strong>
          ) : (
            <Price price={price} assetId={asset.id} size="small" />
          )}
        </div>
        <footer className={styles.footer}>
          {allocated && allocated > 0 ? (
            <span className={styles.typeLabel}>
              {allocated < 0 ? (
                ''
              ) : (
                <>
                  <strong>{formatNumber(allocated, locale, '0')}</strong>{' '}
                  veOCEAN
                </>
              )}
            </span>
          ) : null}
          {orders && orders > 0 ? (
            <span className={styles.typeLabel}>
              {orders < 0 ? (
                'N/A'
              ) : (
                <>
                  <strong>{orders}</strong> {orders === 1 ? 'sale' : 'sales'}
                </>
              )}
            </span>
          ) : null}
          {asset.views && asset.views > 0 ? (
            <span className={styles.typeLabel}>
              {asset.views < 0 ? (
                'N/A'
              ) : (
                <>
                  <strong>{asset.views}</strong>{' '}
                  {asset.views === 1 ? 'view' : 'views'}
                </>
              )}
            </span>
          ) : null}
        </footer>
      </Link>
    </article>
  )
}
