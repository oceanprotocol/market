import React, { ReactElement, useState } from 'react'
import { Tabs as ReactTabs } from 'react-tabs'
import styles from './index.module.css'
import DetailsArrow from '@images/details-arrow.svg'
import UtuIcon from '@images/utu-logo.svg'
import Source from '@images/source.svg'
import Loader from '@shared/atoms/Loader'
import { useSignalContext } from '@context/Signals'
import { getURLParams } from '@hooks/useSignals/_util'
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
  const { datatokens } = asset
  const { assetSignalsUrls, signals } = useSignalContext()
  const assetSignalOrigins = signals
    .filter((signal) => signal.type === 1)
    .filter((signal) => signal.detailView.value)
  const dataTokenAddresses = datatokens.map((data: any) => data.address)
  const urls = assetSignalsUrls.map((item) => {
    return item + getURLParams(['assetId', dataTokenAddresses.join(',')])
  })
  console.log(signalItems)
  const itemsClose = (index?: any) => {
    if (isLoading) return
    const itemsList = signalItems.map((item, index) => {
      if (item.signals.length > 1) {
        return item.signals.map((sig) => {
          return (
            <li key={sig.id + item.title}>
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
      }
      if (item.signals.length === 1)
        return item.title ? (
          <li key={index}>
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
    })
    return itemsList
  }
  const signalDetails = () => {
    console.log(signalItems.length)

    if (isLoading) return
    // return array of [ [SignalsItem, SignalsItem], SignalsItem]
    const sigs = signalItems.map((item, index) => {
      if (item.signals.length > 1) {
        // return @SignalsItem[]
        return item.signals.map((sig) => {
          // Return @SignalsItem
          return (
            <li key={index}>
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
      }
      // if (item.signals.length === 1) {
      //   return (
      //     <>
      //       <>
      //         {item.title ? (
      //           <li key={index}>
      //             {!isLoading ? (
      //               <div className={styles.assetListTitle}>
      //                 <div className={styles.assetListTitleName}>
      //                   <p>
      //                     <UtuIcon className={styles.assetListIcon} />
      //                   </p>
      //                   <p> {item.title} </p>
      //                 </div>
      //                 <div className={styles.assetListTitleNumber}>
      //                   {item.signals[0]?.value ? item.signals[0].value : 'N/A'}
      //                 </div>
      //               </div>
      //             ) : (
      //               <LoaderArea />
      //             )}
      //
      //             {!isLoading ? <p>{item.description}</p> : <LoaderArea />}
      //
      //             {!isLoading ? (
      //               <div className={styles.displaySource}>
      //                 <p>Source</p>
      //                 {item.origin != null ? (
      //                   <a
      //                     target={'_blank'}
      //                     href={item.origin}
      //                     rel="noreferrer"
      //                   >
      //                     <Source className={styles.sourceIcon} />
      //                   </a>
      //                 ) : null}
      //               </div>
      //             ) : (
      //               <LoaderArea />
      //             )}
      //           </li>
      //         ) : null}
      //       </>
      //     </>
      //   )
      // }
    })
    console.log(sigs)
    return sigs.flat()
  }
  const itemsOpen = (index: any) => {
    console.log(signalDetails())
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
            {/*<ol className={styles.assets}>*/}
            {/*  {openUp ? signalDetails() : itemsClose()}*/}
            {/*</ol>*/}
            {openUp ? (
              <ol className={styles.assets}> {signalDetails()}</ol>
            ) : (
              <ol className={styles.assets}> {itemsClose()} </ol>
            )}
          </div>
        </div>
      </ReactTabs>
    </>
  )
}
