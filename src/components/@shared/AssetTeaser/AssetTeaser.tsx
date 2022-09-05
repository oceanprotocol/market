import React, { ReactElement, useEffect } from 'react'
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
import { useSignalContext } from '@context/Signals'
import { getAssetSignalItems } from '@hooks/useSignals/_util'
import Loader from '@shared/atoms/Loader'
import { SignalOriginItem } from '@context/Signals/_types'
import { AssetDatatoken } from '@oceanprotocol/lib/dist/src/@types/Asset'
import AssetTeaserSignals from '../../Signals/AssetTeaserSignals'

declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
  isLoading?: boolean
  signalItems?: SignalOriginItem[]
}

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

export default function AssetTeaser({
  asset,
  noPublisher,
  isLoading,
  signalItems
}: AssetTeaserProps): ReactElement {
  const { datatokens } = asset
  const { signals, assetSignalsUrls } = useSignalContext()
  const filterAssetSignals = () => {
    return signals
      .filter((signal) => signal.type === 1)
      .filter((signal) => signal.listView.value)
  }

  const { name, type, description } = asset.metadata
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft
  const { orders } = asset.stats
  const filteredSignals = getAssetSignalItems(
    signalItems,
    datatokens.map((data: AssetDatatoken) => data.address),
    filterAssetSignals()
  )
  useEffect(() => {
    if (signalItems) {
      // eslint-disable-next-line no-empty
      if (signalItems.length > 0) {
      }
    }
  }, [signalItems])

  if (!signalItems || signalItems.length < 1) {
    return null
  }
  return (
    <>
      <article className={`${styles.teaser} ${styles[type]}`}>
        <div>
          <Link href={`/asset/${asset.id}`}>
            <a className={styles.link}>
              <header className={styles.header}>
                <div className={styles.symbol}>{datatokens[0]?.symbol}</div>
                <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
                  {name.slice(0, 200)}
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
                totalSales={orders}
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
        {signalItems ? (
          <AssetTeaserSignals
            assetId={asset.id}
            signalItems={filteredSignals}
          />
        ) : null}
      </article>
    </>
  )
}
