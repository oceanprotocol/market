import Link from 'next/link'
import styles from '@shared/SignalAssetTeaser/SignalAssetTeaser.module.css'
import assetStyles from '@shared/AssetTeaser/index.module.css'
import UtuIcon from '@images/UtuIcon.svg'
import Tooltip from '@shared/atoms/Tooltip'
import ToolTipSignals from './ToolTipSignals'
import React, { useEffect, useMemo, useState } from 'react'
import { AssetSignalItem, SignalOriginItem } from '@context/Signals/_types'

export function AssetSignalValue({
  signal,
  item,
  index,
  className
}: {
  signal?: SignalOriginItem
  item: AssetSignalItem
  index: number
  className?: string
}) {
  return (
    <div
      key={
        'asset-' + signal?.id
          ? signal?.id
          : item.name + '-' + item.assetId + '-' + index
      }
      className={className || assetStyles.symbol2}
    >
      <UtuIcon className={styles.icon} />
      <div className={styles.signalValue}>{item ? item.value : ''}</div>
    </div>
  )
}

export default function AssetTeaserSignals({
  assetId,
  signalItems
}: {
  assetId: string
  signalItems: SignalOriginItem[]
}) {
  // only show list view enabled signals
  const [filteredSignals, setFilteredSignals] = useState<any[]>([])
  useEffect(() => {
    if (signalItems && Array.isArray(signalItems)) {
      setFilteredSignals(signalItems.filter((signal) => signal.listView.value))
    }
  }, [signalItems])

  const signalsSorted: any[] = useMemo(() => {
    console.log('filteredSignals ', filteredSignals)
    return filteredSignals
      .filter((signal) => signal.signals.length > 0)
      .map((signal) => {
        return signal.signals
      })
      .flat()
      .sort((a: AssetSignalItem, b: AssetSignalItem) => {
        if (isNaN(a.value as number) && !isNaN(b.value as number)) {
          return -1
        }
        if (!isNaN(a.value as number) && isNaN(b.value as number)) {
          return 1
        }
        return 0
      })
  }, [filteredSignals])

  const signalsNumbers: any[] = useMemo(() => {
    return signalsSorted
      .filter((item) => item)
      .filter((item) => {
        console.log(isNaN(item.value))
        return !isNaN(item.value)
      })
  }, [signalsSorted])

  const signalsText: any[] = useMemo(() => {
    return signalsSorted
      .filter((item) => item)
      .filter((item) => {
        return isNaN(item.value)
      })
  }, [signalsSorted])

  const signalsNumbersElements: any[] = useMemo(() => {
    return signalsNumbers.map((item: AssetSignalItem, index: number) => {
      return (
        <AssetSignalValue
          key={`asset-signal-value-1-${item.assetId}-${index}`}
          item={item}
          index={index}
        />
      )
    })
  }, [signalsNumbers])
  const signalsTextElements: any[] = useMemo(() => {
    return signalsText.map((item: AssetSignalItem, index: number) => {
      return (
        <AssetSignalValue
          key={`asset-signal-value-2-${item.assetId}-${index}`}
          item={item}
          index={index}
          className={assetStyles.symbol2Long}
        />
      )
    })
  }, [signalsText])

  console.log('signalsNumbers ', signalsNumbers)

  const noSignalsEl = (
    <Link href={`/asset/${assetId}`}>
      <a className={styles.signalContainer}>
        <div className={styles.signal}> No Signals Available</div>
      </a>
    </Link>
  )
  if (filteredSignals.length > 0) {
    if (
      signalsNumbersElements.length === 0 &&
      signalsTextElements.length === 0
    ) {
      return noSignalsEl
    }

    return (
      <div>
        <Link href={`/asset/${assetId}`}>
          <a className={styles.signalContainer}>
            <div className={styles.signal}>
              {signalsNumbersElements}
              <div className={styles.signalTooltipContainer}>
                <Tooltip
                  className={styles.signalTooltip}
                  content={<ToolTipSignals signalItems={filteredSignals} />}
                />
              </div>
            </div>
            <div className={styles.sigcontainer}>{signalsTextElements} </div>
          </a>
        </Link>
      </div>
    )
  } else {
    return noSignalsEl
  }
}
