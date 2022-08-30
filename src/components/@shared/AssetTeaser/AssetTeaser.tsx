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
import PolygonIcon from '@images/polygon.svg'
import { useSignalContext } from '@context/Signals'
import { getURLParams } from '@hooks/useSignals/_util'
import useSignalsLoader from '@hooks/useSignals'
import Loader from '@shared/atoms/Loader'
import Tooltip from '@shared/atoms/Tooltip'
import UtuIcon from '@images/utu-logo.svg'
import { AssetSignalItem } from '@context/Signals/_types'

declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
  isLoading?: boolean
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
  isLoading
}: AssetTeaserProps): ReactElement {
  const { datatokens } = asset
  const { assetSignalsUrls, signals } = useSignalContext()
  const assetSignalOrigins = signals.filter((signal) => signal.type === 1)
  const dataTokenAddresses = datatokens.map((data) => data.address)
  const urls = assetSignalsUrls.map((item) => {
    return item + getURLParams(['assetId', dataTokenAddresses.join(',')])
  })
  const { name, type, description } = asset.metadata
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft
  const { signalItems, loading } = useSignalsLoader(urls)
  useEffect(() => {
    console.log(signalItems)
  })
  const loadedAssetSignals = signalItems.map(
    (signal: AssetSignalItem, index) => {
      if (!signal) return null
      return (
        <div key={signal.id} className={styles.symbol2}>
          <PolygonIcon className={styles.icon} />
          <div>
            {signal
              ? ((signal[0]?.value / 100) * Math.random()).toPrecision(2) + '%'
              : ''}
          </div>
        </div>
      )
    }
  )
  let toolTipSignals = assetSignalOrigins.map((signal, index) => {
    return (
      <li key={index}>
        <div className={styles.assetListTitle}>
          <div className={styles.assetListTitleName}>
            <UtuIcon className={styles.icon} />
            <p>{signal.description}</p>
          </div>
          <div className={styles.assetListTitleNumber}>
            <p>
              {signalItems[index]
                ? (
                    (parseInt(signalItems[index][0]?.value || '0') / 100) *
                    Math.random()
                  ).toPrecision(2) + '%'
                : 'N/A'}
            </p>
          </div>
        </div>
      </li>
    )
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  toolTipSignals = <ol className={styles.assets}>{toolTipSignals}</ol>
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
            <a className={styles.signalContainer}>
              <div className={styles.signal}>
                {signalItems.length > 0 &&
                  signalItems.map((signal, index) => {
                    if (!signal) return null
                    return (
                      <div key={signal.id} className={styles.symbol2}>
                        <PolygonIcon className={styles.icon} />
                        <div>
                          {signal
                            ? (signal[0]?.value / 100).toPrecision(2) + '%'
                            : ''}
                        </div>
                      </div>
                    )
                  })}
              </div>
              <div>
                {' '}
                <Tooltip content={toolTipSignals} />
              </div>
            </a>
          </Link>
        </div>
      </article>
    </>
  )
}
