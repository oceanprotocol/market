import Link from 'next/link'
import styles from '@shared/SignalAssetTeaser/SignalAssetTeaser.module.css'
import assetStyles from '@shared/AssetTeaser/index.module.css'
import UtuIcon from '@images/UtuIcon.svg'
import Tooltip from '@shared/atoms/Tooltip'
import ToolTipSignals from './ToolTipSignals'
import React from 'react'
import { SignalOriginItem } from '@context/Signals/_types'

export default function AssetTeaserSignals({
  assetId,
  signalItems
}: {
  assetId: string
  signalItems: SignalOriginItem[]
}) {
  let itemsList: any[] = []
  const noSignalsEl = (
    <Link href={`/asset/${assetId}`}>
      <a className={styles.signalContainer}>
        <div className={styles.signal}> No Signals Available</div>
      </a>
    </Link>
  )
  if (signalItems.length > 0) {
    signalItems.forEach((signal) => {
      if (signal.signals.length >= 1 && signal.signals.length < 4) {
        itemsList.push(
          signal.signals.map((item, index) => (
            <div key={index} className={assetStyles.symbol2}>
              <UtuIcon className={styles.icon} />
              <div>{item ? item.value : ''}</div>
            </div>
          ))
        )
      }
    })
    itemsList = itemsList.flat()
    if (itemsList.length === 0) {
      return noSignalsEl
    }

    return (
      <div>
        <Link href={`/asset/${assetId}`}>
          <a className={styles.signalContainer}>
            <div className={styles.signal}>
              {itemsList.length > 3 ? itemsList.slice(0, 3) : itemsList}
            </div>
            <div className={styles.signalTooltipContainer}>
              <Tooltip
                className={styles.signalTooltip}
                content={<ToolTipSignals signalItems={signalItems} />}
              />
            </div>
          </a>
        </Link>
      </div>
    )
  } else {
    return noSignalsEl
  }
}
