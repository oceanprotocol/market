import Link from 'next/link'
import styles from '@shared/SignalAssetTeaser/SignalAssetTeaser.module.css'
import assetStyles from '@shared/AssetTeaser/index.module.css'
import UtuIcon from '@images/UtuIcon.svg'
import Tooltip from '@shared/atoms/Tooltip'
import ToolTipSignals from './ToolTipSignals'
import React, { useEffect, useState } from 'react'
import { AssetSignalItem, SignalOriginItem } from '@context/Signals/_types'

export default function AssetTeaserSignals({
  assetId,
  signalItems
}: {
  assetId: string
  signalItems: SignalOriginItem[]
}) {
  let itemsList: any[] = []
  // only show list view enabled signals
  const [filteredSignals, setFilteredSignals] = useState<any[]>([])
  useEffect(() => {
    if (signalItems && Array.isArray(signalItems)) {
      setFilteredSignals(signalItems.filter((signal) => signal.listView.value))
    }
  }, [signalItems])

  const noSignalsEl = (
    <Link href={`/asset/${assetId}`}>
      <a className={styles.signalContainer}>
        <div className={styles.signal}> No Signals Available</div>
      </a>
    </Link>
  )
  if (filteredSignals.length > 0) {
    filteredSignals.forEach((signal) => {
      if (signal.signals.length >= 1 && signal.signals.length < 4) {
        itemsList.push(
          signal.signals.map((item: AssetSignalItem, index: number) => (
            <div
              key={'asset-' + signal.id + '-' + item.assetId + '-' + index}
              className={assetStyles.symbol2}
            >
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
                content={<ToolTipSignals signalItems={filteredSignals} />}
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
