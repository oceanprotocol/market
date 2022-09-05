import Link from 'next/link'
import styles from '@shared/AssetTeaser/AssetTeaser.module.css'
import PolygonIcon from '@images/polygon.svg'
import Tooltip from '@shared/atoms/Tooltip'
import ToolTipSignals from './ToolTipSignals'
import React from 'react'
import { SignalOriginItem } from '@context/Signals/_types'
import { LoaderArea } from '@shared/AssetList'

export default function AssetTeaserSignals({
  assetId,
  signalItems
}: {
  assetId: string
  signalItems: SignalOriginItem[]
}) {
  let itemsList: any[] = []
  if (signalItems.length > 0) {
    signalItems.forEach((signal, index) => {
      if (signal.signals.length >= 1 && signal.signals.length < 4) {
        itemsList.push(
          signal.signals.map((item, index) => (
            <div key={index} className={styles.symbol2}>
              <PolygonIcon className={styles.icon} />
              <div>{item ? item.value : ''}</div>
            </div>
          ))
        )
      }
    })
    itemsList = itemsList.flat()
    if (itemsList.length === 0) {
      return (
        <div>
          <Link href={`/asset/${assetId}`}>
            <a className={styles.signalContainer}>
              No Signals Available
              <div className={styles.signal}></div>
              <div>
                {/*{' '}*/}
                {/*<Tooltip content={<ToolTipSignals signalItems={signalItems} />} />*/}
              </div>
            </a>
          </Link>
        </div>
      )
    }
    return (
      <div>
        <Link href={`/asset/${assetId}`}>
          <a className={styles.signalContainer}>
            <div className={styles.signal}>
              {itemsList.length > 3 ? itemsList.slice(0, 3) : itemsList}
            </div>
            <div>
              {' '}
              <Tooltip content={<ToolTipSignals signalItems={signalItems} />} />
            </div>
          </a>
        </Link>
      </div>
    )
  }
  return <LoaderArea />
}
