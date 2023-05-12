import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import FormConsumerParameters from './FormConsumerParameters'
import styles from './index.module.css'
import Tabs, { TabsItem } from '@components/@shared/atoms/Tabs'
import { FormConsumerParameter } from '@components/Publish/_types'

const getFormParameterValue = (
  type: ConsumerParameter['type'],
  value: string | number | boolean
) => {
  if (type === 'boolean') {
    if (value === '') return ''
    if (value) return 'true'
    return 'false'
  }

  return value
}

export function generateFormConsumerParameters(
  consumerParameters: ConsumerParameter[]
): FormConsumerParameter[] {
  if (!consumerParameters?.length) return

  return consumerParameters.map((param) => {
    const formParam = {
      ...param,
      value: getFormParameterValue(param.type, param.default)
    }

    if (param.type === 'select') {
      formParam.options = JSON.parse(param.options as string)
    }

    return formParam
  })
}

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
            name="dataServiceParams"
            parameters={generateFormConsumerParameters(
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
            name="algoServiceParams"
            parameters={generateFormConsumerParameters(
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
            parameters={generateFormConsumerParameters(
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
