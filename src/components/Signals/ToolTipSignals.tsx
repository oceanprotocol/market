import styles from '@shared/AssetTeaser/index.module.css'
import UtuIcon from '@images/utu-logo.svg'
import React from 'react'
import { SignalOriginItem } from '@context/Signals/_types'

export default function ToolTipSignals({
  signalItems
}: {
  signalItems: SignalOriginItem[]
}) {
  if (!signalItems || signalItems.length < 1) return
  return (
    <ol className={styles.assets}>
      {signalItems.map((signal, index) => {
        return (
          <li key={index}>
            <div className={styles.assetListTitle}>
              <div className={styles.assetListTitleName}>
                <UtuIcon className={styles.icon} />
                <p>
                  {signal.title} - {signal.description}
                </p>
              </div>
              <div className={styles.assetListTitleNumber}>
                <p>
                  {signal.signals
                    ? (
                        (parseInt(signal.signals[0]?.value || '0') / 100) *
                        Math.random()
                      ).toPrecision(2) + '%'
                    : 'N/A'}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
