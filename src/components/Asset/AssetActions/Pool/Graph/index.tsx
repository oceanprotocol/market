import React, { ReactElement, useEffect, useState } from 'react'
import { ChartData, ChartOptions } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import Loader from '@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import useDarkMode from 'use-dark-mode'
import { darkModeConfig } from '../../../../../../app.config'
import { LoggerInstance } from '@oceanprotocol/lib'
import styles from './index.module.css'
import Decimal from 'decimal.js'
import { lineStyle, GraphType } from './_constants'
import Nav from './Nav'
import { getOptions } from './_utils'
import { PoolData_poolSnapshots as PoolDataPoolSnapshots } from 'src/@types/subgraph/PoolData'

export default function Graph({
  poolSnapshots
}: {
  poolSnapshots: PoolDataPoolSnapshots[]
}): ReactElement {
  const { locale } = useUserPreferences()
  const darkMode = useDarkMode(false, darkModeConfig)

  const [options, setOptions] = useState<ChartOptions<any>>()
  const [graphType, setGraphType] = useState<GraphType>('liquidity')
  const [graphData, setGraphData] = useState<ChartData<any>>()

  //
  // 0 Get Graph options
  //
  useEffect(() => {
    LoggerInstance.log('[pool graph] Fired getOptions().')
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value, graphType])

  //
  // 1 Data manipulation
  //
  useEffect(() => {
    if (!poolSnapshots) return

    const timestamps = poolSnapshots.map((item) => {
      const date = new Date(item.date * 1000)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    })

    let baseTokenLiquidityCumulative = '0'
    const liquidityHistory = poolSnapshots.map((item) => {
      baseTokenLiquidityCumulative = new Decimal(baseTokenLiquidityCumulative)
        .add(item.baseTokenLiquidity)
        .toString()
      return baseTokenLiquidityCumulative
    })

    const priceHistory = poolSnapshots.map((item) => item.spotPrice)

    let volumeCumulative = '0'
    const volumeHistory = poolSnapshots.map((item) => {
      volumeCumulative = new Decimal(volumeCumulative)
        .add(item.swapVolume)
        .toString()
      return volumeCumulative
    })

    let data
    switch (graphType) {
      case 'price':
        data = priceHistory.slice(0)
        break
      case 'volume':
        data = volumeHistory.slice(0)
        break
      default:
        data = liquidityHistory.slice(0)
        break
    }

    const newGraphData = {
      labels: timestamps.slice(0),
      datasets: [{ ...lineStyle, data, borderColor: `#8b98a9` }]
    }
    setGraphData(newGraphData)
    LoggerInstance.log('[pool graph] New graph data created:', newGraphData)
  }, [poolSnapshots, graphType])

  return (
    <div className={styles.graphWrap}>
      {!graphData ? (
        <Loader />
      ) : (
        <>
          <Nav graphType={graphType} setGraphType={setGraphType} />

          {graphType === 'volume' ? (
            <Bar width={416} height={120} data={graphData} options={options} />
          ) : (
            <Line width={416} height={120} data={graphData} options={options} />
          )}
        </>
      )}
    </div>
  )
}
