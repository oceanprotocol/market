import React, { ReactElement, useState } from 'react'
import { Tabs as ReactTabs } from 'react-tabs'
import styles from './index.module.css'
import DetailsArrow from '@images/details-arrow.svg'
import UtuIcon from '@images/utu-logo.svg'
import Source from '@images/source.svg'
import Loader from '@shared/atoms/Loader'
import { useSignalContext } from '@context/Signals'
import { getURLParams } from '@hooks/useSignals/_util'
import useSignalsLoader from '@hooks/useSignals'
import { AssetExtended } from '../../../../@types/AssetExtended'

export interface TabsProps {
  className?: string
  defaultIndex?: number
  isLoading?: boolean
  asset?: AssetExtended
}

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

export default function AssetSignals({
  className,
  defaultIndex,
  isLoading,
  asset
}: TabsProps): ReactElement {
  const [openUp, setOpenUp] = useState(false)
  const [loading, setLoading] = useState<boolean>(isLoading)
  const { datatokens } = asset
  const { assetSignalsUrls, signals } = useSignalContext()
  const assetSignalOrigins = signals.filter((signal) => signal.type === 1)
  const dataTokenAddresses = datatokens.map((data) => data.address)
  const urls = assetSignalsUrls.map((item) => {
    return item + getURLParams(['assetId', dataTokenAddresses.join(',')])
  })
  const { signalItems, loading: isFetching } = useSignalsLoader(urls)

  const itemsClose = (index: any) => {
    return assetSignalOrigins.map((item, index) => {
      return (
        <>
          <>
            {item.title ? (
              <li key={index}>
                {!loading ? (
                  <div className={styles.assetListTitle}>
                    <div className={styles.assetListTitleName}>
                      <p>
                        <UtuIcon className={styles.assetListIcon} />
                      </p>
                      <p> {item.title} </p>
                    </div>
                    <div className={styles.assetListTitleNumber}>
                      {signalItems[index] ? signalItems[index][0].value : 'N/A'}
                    </div>
                  </div>
                ) : (
                  <LoaderArea />
                )}
              </li>
            ) : null}
          </>
        </>
      )
    })
  }

  const signalDetails = () => {
    return assetSignalOrigins.map((item, index) => {
      return (
        <>
          <>
            {item.title ? (
              <li key={index}>
                {!loading ? (
                  <div className={styles.assetListTitle}>
                    <div className={styles.assetListTitleName}>
                      <p>
                        <UtuIcon className={styles.assetListIcon} />
                      </p>
                      <p> {item.title} </p>
                    </div>
                    <div className={styles.assetListTitleNumber}>
                      {signalItems[index] ? signalItems[index][0].value : 'N/A'}
                    </div>
                  </div>
                ) : (
                  <LoaderArea />
                )}

                {!loading ? <p>{item.description}</p> : <LoaderArea />}

                {!loading ? (
                  <div href={item.origin} className={styles.displaySource}>
                    <p>Source</p>
                    {item.origin != null ? (
                      <a target={'_blank'} href={item.origin} rel="noreferrer">
                        <Source className={styles.sourceIcon} />
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <LoaderArea />
                )}
              </li>
            ) : null}
          </>
        </>
      )
    })
  }
  const itemsOpen = (index: any) => {
    return signalDetails()
  }
  return (
    <>
      <ReactTabs className={`${className || ''}`} defaultIndex={defaultIndex}>
        <div className={styles.AssetSignalsContent}>
          <div className={styles.AssetSignalsContentTitle}>
            <h3>Asset Signal</h3>
            <h3 className={styles.details}>
              {openUp ? 'HIDE DETAILS' : 'SHOW DETAILS'}

              <div
                onClick={() => {
                  setOpenUp(!openUp)
                }}
              >
                {' '}
                <DetailsArrow
                  className={
                    openUp
                      ? styles.AssetSignalsIconDown
                      : styles.AssetSignalsIconUp
                  }
                />
              </div>
            </h3>
          </div>
          <div>
            {' '}
            <ol className={styles.assets}>
              {openUp ? itemsOpen(!openUp) : itemsClose(!openUp)}
            </ol>
          </div>
        </div>
      </ReactTabs>
    </>
  )
}
