import React, { ReactElement, useState } from 'react'
import { Tabs as ReactTabs } from 'react-tabs'
import styles from './index.module.css'
import DetailsArrow from '@images/details-arrow.svg'
import UtuIcon from '@images/UtuIcon.svg'
import Source from '@images/source.svg'
import Loader from '@shared/atoms/Loader'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AssetExtended } from '../../../../@types/AssetExtended'
import { SignalOriginItem } from '@context/Signals/_types'

export interface TabsProps {
  className?: string
  defaultIndex?: number
  isLoading?: boolean
  asset?: AssetExtended
  signalItems?: SignalOriginItem[]
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
  asset,
  signalItems
}: TabsProps): ReactElement {
  const [openUp, setOpenUp] = useState(false)
  const itemsClose = () => {
    if (isLoading) return <LoaderArea />
    const itemsList: any[] = []
    signalItems.forEach((item, index) => {
      if (item.signals.length > 1) {
        itemsList.push(
          item.signals.map((sig, index) => {
            return (
              <li key={sig.id + item.title + index}>
                {sig ? (
                  <div className={styles.assetListTitle}>
                    <div className={styles.assetListTitleName}>
                      <p>
                        <UtuIcon className={styles.assetListIcon} />
                      </p>
                      <p> {item.title} </p>
                    </div>
                    <div className={styles.assetListTitleNumber}>
                      {sig.value ? sig.value : 'N/A'}
                    </div>
                  </div>
                ) : (
                  <LoaderArea />
                )}
              </li>
            )
          })
        )
      }
      if (item.signals.length === 1) {
        itemsList.push(
          item.title ? (
            <li key={item.id + item.title + index}>
              {item.signals ? (
                <div className={styles.assetListTitle}>
                  <div className={styles.assetListTitleName}>
                    <p>
                      <UtuIcon className={styles.assetListIcon} />
                    </p>
                    <p> {item.title} </p>
                  </div>
                  <div className={styles.assetListTitleNumber}>
                    {item.signals.length > 0 ? item.signals[0].value : 'N/A'}
                  </div>
                </div>
              ) : (
                <LoaderArea />
              )}
            </li>
          ) : null
        )
      }
    })
    return itemsList.filter((item) => item)
  }
  const signalDetails = () => {
    if (isLoading) return <LoaderArea />
    // return array of [ [SignalsItem, SignalsItem], SignalsItem]
    const sigs: any[] = []
    signalItems.forEach((item, index) => {
      if (item.signals.length > 1) {
        // return @SignalsItem[]
        sigs.push(
          item.signals.map((sig) => {
            // Return @SignalsItem
            return (
              <li key={sig.id + item.title + index}>
                {item.signals.length > 0 ? (
                  <div className={styles.assetListTitle}>
                    <div className={styles.assetListTitleName}>
                      <p>
                        <UtuIcon className={styles.assetListIcon} />
                      </p>
                      <p> {item.title} </p>
                    </div>
                    <div className={styles.assetListTitleNumber}>
                      {sig ? sig.value : 'N/A'}
                    </div>
                  </div>
                ) : (
                  <LoaderArea />
                )}

                {!isLoading ? <p>{item.description}</p> : <LoaderArea />}

                {!isLoading ? (
                  <div className={styles.displaySource}>
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
            )
          })
        )
      }
    })
    return sigs.flat()
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
            <ol
              style={{ display: openUp ? 'block' : 'none' }}
              className={styles.assets}
            >
              {signalDetails()}
            </ol>
            <ol
              style={{ display: !openUp ? 'block' : 'none' }}
              className={styles.assets}
            >
              {itemsClose()}
            </ol>
          </div>
        </div>
      </ReactTabs>
    </>
  )
}
