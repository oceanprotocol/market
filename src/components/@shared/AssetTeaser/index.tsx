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
import { formatPrice } from '@shared/Price/PriceUnit'
import { useUserPreferences } from '@context/UserPreferences'

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
  const { orders, allocated } = asset.stats
  const isUnsupportedPricing = asset?.accessDetails?.type === 'NOT_SUPPORTED'
  const { locale } = useUserPreferences()

  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link href={`/asset/${asset.id}`}>
        <a className={styles.link}>
          <aside className={styles.detailLine}>
            <AssetType
              className={styles.typeLabel}
              type={type}
              accessType={accessType}
            />
            <span className={styles.typeLabel}>{datatokens[0]?.symbol}</span>
            <NetworkName
              networkId={asset.chainId}
              className={styles.typeLabel}
            />
          </aside>
          <header className={styles.header}>
            <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
              {name.slice(0, 200)}
            </Dotdotdot>
            {!noPublisher && <Publisher account={owner} minimal />}
          </header>
          <div className={styles.content}>
            <Dotdotdot tagName="p" clamp={3}>
              {removeMarkdown(description?.substring(0, 300) || '')}
            </Dotdotdot>
          </div>
          {isUnsupportedPricing ? (
            <strong>No pricing schema available</strong>
          ) : (
            <Price accessDetails={asset.accessDetails} size="small" />
          )}
          <footer className={styles.footer}>
            {allocated && allocated > 0 ? (
              <span className={styles.typeLabel}>
                {allocated < 0
                  ? ''
                  : `${formatPrice(allocated, locale)} veOCEAN`}
              </span>
            ) : null}
            {orders && orders > 0 ? (
              <span className={styles.typeLabel}>
                {orders < 0
                  ? 'N/A'
                  : `${orders} ${orders === 1 ? 'sale' : 'sales'}`}
              </span>
            ) : null}
          </footer>
        </a>
      </Link>
    </article>
  )
}
