import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import FormConsumerParameters from './FormConsumerParameters'
import { parseConsumerParameters } from '@utils/ddo'
import styles from './index.module.css'
import Tabs, { TabsItem } from '@components/@shared/atoms/Tabs'

export default function ConsumerParameters({
  asset,
  selectedAlgorithmAsset
}: {
  asset: AssetExtended
  selectedAlgorithmAsset?: AssetExtended
}): ReactElement {
  const [tabs, setTabs] = useState<TabsItem[]>([])

  const updateTabs = useCallback(() => {
    const tabs = []
    if (asset?.services[0]?.consumerParameters) {
      tabs.push({
        title: 'Data Service',
        content: (
          <FormConsumerParameters
            name="dataService"
            parameters={parseConsumerParameters(
              asset.services[0].consumerParameters
            )}
          />
        )
      })
    }
    if (selectedAlgorithmAsset?.services[0]?.consumerParameters) {
      tabs.push({
        title: 'Algo Service',
        content: (
          <FormConsumerParameters
            name="algoService"
            parameters={parseConsumerParameters(
              selectedAlgorithmAsset.services[0].consumerParameters
            )}
          />
        )
      })
    }
    if (selectedAlgorithmAsset?.metadata?.algorithm?.consumerParameters) {
      tabs.push({
        title: 'Algo Params',
        content: (
          <FormConsumerParameters
            name="algoParams"
            parameters={parseConsumerParameters(
              selectedAlgorithmAsset.metadata?.algorithm.consumerParameters
            )}
          />
        )
      })
    }

    return tabs
  }, [asset, selectedAlgorithmAsset])

  useEffect(() => {
    setTabs(updateTabs())
  }, [updateTabs])

  return (
    <div className={styles.container}>
      {tabs.length > 0 && <Tabs items={tabs} />}
    </div>
  )
}
