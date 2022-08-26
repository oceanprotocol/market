import React, { ReactElement, useState } from 'react'
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
import Markdown from '@shared/Markdown'
import { Tabs as ReactTabs } from 'react-tabs'
import UtuIcon from '@images/utu-logo.svg'

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
  const { signalUrls } = useSignalContext()
  const urls = signalUrls.map((item) => {
    return item + getURLParams(['assetId', asset.id])
  })
  const { name, type, description } = asset.metadata
  const { datatokens } = asset
  const isCompute = Boolean(getServiceByName(asset, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const { owner } = asset.nft
  const { signalItems, loading: isFetching } = useSignalsLoader(urls)
  const [loading, setLoading] = useState<boolean>(isLoading)

  // const assetSignals = Object.values(contentAsset).map((value) => {
  //   return value.source
  // })

  // const signals = () =>
  //   Object.entries(contentAsset).map(([key, value], index) => (
  //     <>
  //       <>
  //         {value.name.length > 0 ? (
  //           <li key={index}>
  //             <div className={styles.symbol2}>
  //               <PolygonIcon className={styles.icon} />{' '}
  //               <div>{value.number}</div>
  //             </div>
  //           </li>
  //         ) : null}
  //       </>
  //     </>
  //   ))
  const assetSignals = (
    <ol className={styles.assets}>
      <li key="1">
        <div className={styles.assetListTitle}>
          <div className={styles.assetListTitleName}>
            <UtuIcon className={styles.icon} />
            <p>Rug pull index - Rating</p>
          </div>
          <div className={styles.assetListTitleNumber}>
            <p>39%</p>
          </div>
        </div>
      </li>

      <li key="2">
        <div className={styles.assetListTitle}>
          <div className={styles.assetListTitleName}>
            <UtuIcon className={styles.icon} />
            <p>Rug pull index - Inequality</p>
          </div>
          <div className={styles.assetListTitleNumber}>
            <p>39%</p>
          </div>
        </div>
      </li>

      <li key="3">
        <div className={styles.assetListTitle}>
          <div className={styles.assetListTitleName}>
            <UtuIcon className={styles.icon} />
            <p>UTU - usage in your network</p>
          </div>
          <div className={styles.assetListTitleNumber}>
            <p>4</p>
          </div>
        </div>
      </li>
    </ol>
  )
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
                {/* {!loading ? { signals } : <LoaderArea />} */}

                {!loading ? (
                  <div className={styles.symbol2}>
                    <PolygonIcon className={styles.icon} />
                    <div>38%</div>
                  </div>
                ) : (
                  <LoaderArea />
                )}
                {!loading ? (
                  <div className={styles.symbol2}>39%</div>
                ) : (
                  <LoaderArea />
                )}
                {!loading ? (
                  <div className={styles.symbol2}>4</div>
                ) : (
                  <LoaderArea />
                )}
              </div>
              <div>
                {' '}
                <Tooltip content={assetSignals} />
              </div>
            </a>
          </Link>
        </div>
      </article>
    </>
  )
}
