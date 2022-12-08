import styles from '@shared/AssetTeaser/index.module.css'
import styles2 from './tooltipSignals.module.css'
import UtuIcon from '@images/UtuIcon.svg'
import React from 'react'
import { SignalOriginItem } from '@context/Signals/_types'

export default function ToolTipSignals({
  signalItems
}: {
  signalItems: SignalOriginItem[]
}) {
  if (!signalItems || signalItems.length < 1) return
  return (
    <ol className={`${styles.assets} ${styles2.tooltipSignalsContainer}`}>
      {signalItems.map((signal) => {
        if (signal.signals.length > 0) {
          return signal.signals.map((sig, index) => {
            return (
              <li key={'tooltip-' + signal.id + '-' + sig.assetId + index}>
                <div className={styles.assetListTitle}>
                  <div className={styles.assetListTitleName}>
                    <UtuIcon className={styles.icon} />
                    <p className={styles2.signalName}>
                      {sig.name ? sig.name : signal.title} - {sig.description}
                    </p>
                  </div>
                  <div className={styles.assetListTitleNumber}>
                    <p className={styles2.signalValue}>
                      {sig.value ? sig.value : 'N/A'}
                    </p>
                  </div>
                </div>
              </li>
            )
          })
        }
        return null
      })}
    </ol>
  )
}
