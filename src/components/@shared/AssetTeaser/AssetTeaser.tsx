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
import { useSignalContext } from '@context/Signals'
import { getURLParams } from '@hooks/useSignals/_util'
import useSignalsLoader from '@hooks/useSignals'
import Loader from '@shared/atoms/Loader'
import Tooltip from '@shared/atoms/Tooltip'

declare type AssetTeaserProps = {
  asset: AssetExtended
  noPublisher?: boolean
}

export default function AssetTeaser({
  asset,
  noPublisher
}: AssetTeaserProps): ReactElement {
  const { signalUrls } = useSignalContext()
  const urls = signalUrls.map((item) => {
    return item + getURLParams(['assetId', asset.id])
  })
  const { name, type, description } = asset.metadata
  const { datatokens } = asset
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft
  const { signalItems, loading } = useSignalsLoader(urls)
  return (
    <article className={`${styles.teaser} ${styles[type]}`}>
      <Link href={`/asset/${asset.id}`}>
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
            <Price accessDetails={asset.accessDetails} size="small" />
            <NetworkName networkId={asset.chainId} className={styles.network} />
          </footer>
          {loading && (
            <div
              className={styles.content}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Loader />
              <span className={styles.signalLoaderText}>
                Loading signals...
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            {signalItems.map((signal, index) => {
              return (
                <span key={index} className={styles.signalUnit}>
                  {signal
                    ? ((signal[0]?.value / 100) * Math.random()).toPrecision(
                        2
                      ) + '%'
                    : ''}
                </span>
              )
            })}
            <Tooltip
              style={{ float: 'right' }}
              content="Show a hover card for the signal items"
            />
          </div>
        </a>
      </Link>
    </article>
  )
}
