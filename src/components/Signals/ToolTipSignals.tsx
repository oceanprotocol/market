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
  console.log(signalItems)
  return (
    <ol className={styles.assets}>
      {signalItems.map((signal, index) => {
        if (signal.signals.length > 0) {
          return signal.signals.map((sig) => {
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
                    <p>{sig.value ? sig.value : 'N/A'}</p>
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
