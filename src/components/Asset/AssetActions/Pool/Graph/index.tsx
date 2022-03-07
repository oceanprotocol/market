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
import { usePrices } from '@context/Prices'
import { MAX_DECIMALS } from '@utils/constants'

export default function Graph({
  poolSnapshots
}: {
  poolSnapshots: PoolDataPoolSnapshots[]
}): ReactElement {
  const { locale, currency } = useUserPreferences()
  const { prices } = usePrices()
  const darkMode = useDarkMode(false, darkModeConfig)

  const [options, setOptions] = useState<ChartOptions<any>>()
  const [graphType, setGraphType] = useState<GraphType>('tvl')
  const [graphData, setGraphData] = useState<ChartData<any>>()

  //
  // 0 Get Graph options
  //
  useEffect(() => {
    if (!poolSnapshots) return

    LoggerInstance.log('[pool graph] Fired getOptions().')
    const symbol =
      graphType === 'tvl' ? currency : poolSnapshots[0]?.baseToken?.symbol
    const options = getOptions(locale, darkMode.value, symbol)
    setOptions(options)
  }, [locale, darkMode.value, graphType, currency, poolSnapshots])

  //
  // 1 Data manipulation
  //
  useEffect(() => {
    if (!poolSnapshots) return

    const timestamps = poolSnapshots.map((item) => {
      const date = new Date(item.date * 1000)
      return `${date.toLocaleDateString(locale)}`
    })

    const tvlHistory = poolSnapshots.map((item) => {
      const conversionSpotPrice = prices[currency.toLowerCase()]

      const tvl = new Decimal(item.baseTokenLiquidity)
        .mul(2)
        .mul(conversionSpotPrice) // convert to user currency
        .toString()
      return tvl
    })

    const priceHistory = poolSnapshots.map((item) => item.spotPrice)
    const volumeHistory = poolSnapshots.map((item) => {
      const volume = new Decimal(item.swapVolume)
        .toDecimalPlaces(MAX_DECIMALS)
        .toString()
      return volume
    })

    let data
    switch (graphType) {
      case 'price':
        data = priceHistory
        break
      case 'volume':
        data = volumeHistory
        break
      default:
        data = tvlHistory
        break
    }

    const newGraphData = {
      labels: timestamps,
      datasets: [{ ...lineStyle, data, borderColor: `#8b98a9` }]
    }
    setGraphData(newGraphData)
    LoggerInstance.log('[pool graph] New graph data created:', newGraphData)
  }, [poolSnapshots, graphType, currency, prices, locale])

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
