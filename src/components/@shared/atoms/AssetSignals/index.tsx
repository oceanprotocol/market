import React, { ReactElement, useState } from 'react'
import { Tabs as ReactTabs } from 'react-tabs'
import styles from './index.module.css'
import contentAsset from '../../../../../content/settings/assets.json'
import DetailsArrow from '@images/details-arrow.svg'
import UtuIcon from '@images/utu-logo.svg'
import Source from '@images/source.svg'
import Loader from '@shared/atoms/Loader'

export interface TabsProps {
  className?: string
  defaultIndex?: number
  isLoading?: boolean
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
  isLoading
}: TabsProps): ReactElement {
  const [openUp, setOpenUp] = useState(false)
  const [loading, setLoading] = useState<boolean>(isLoading)

  const itemsClose = (index: any) =>
    Object.entries(contentAsset).map(([key, value], index) => (
      <>
        <>
          {value.name.length > 0 ? (
            <li key={index}>
              <div className={styles.assetListTitle}>
                <div className={styles.assetListTitleName}>
                  <UtuIcon className={styles.assetListIcon} />
                  <p> {value.name}</p>
                </div>
                <div className={styles.assetListTitleNumber}>
                  <p>{value.number}</p>
                </div>
              </div>
            </li>
          ) : null}
        </>
      </>
    ))

  const itemsOpen = (index: any) =>
    Object.entries(contentAsset).map(([key, value], index) => (
      <>
        <>
          {value.name.length > 0 ? (
            <li key={index}>
              {!loading ? (
                <div className={styles.assetListTitle}>
                  <div className={styles.assetListTitleName}>
                    <p>
                      <UtuIcon className={styles.assetListIcon} />
                    </p>
                    <p> {value.name} </p>
                  </div>

                  <div className={styles.assetListTitleNumber}>
                    {value.number}
                  </div>
                </div>
              ) : (
                <LoaderArea />
              )}

              {!loading ? <p>{value.description}</p> : <LoaderArea />}

              {!loading ? (
                <div className={styles.displaySource}>
                  <p>{value.source}</p>
                  {value.source != null ? (
                    <Source className={styles.sourceIcon} />
                  ) : null}
                </div>
              ) : (
                <LoaderArea />
              )}
            </li>
          ) : null}
        </>
      </>
    ))

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
