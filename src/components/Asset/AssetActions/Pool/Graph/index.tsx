import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  ChartData,
  ChartOptions,
  defaults,
  ChartDataset,
  TooltipOptions,
  TooltipItem,
  BarElement,
  LineElement,
  LineController,
  BarController
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import Loader from '@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import useDarkMode from 'use-dark-mode'
import { darkModeConfig } from '../../../../../../app.config'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import { OperationResult } from 'urql'
import { PoolHistory } from '../../../../../@types/subgraph/PoolHistory'
import { fetchData, getQueryContext } from '@utils/subgraph'
import styles from './index.module.css'
import Decimal from 'decimal.js'
import {
  poolHistoryQuery,
  getOptions,
  lineStyle,
  GraphType
} from './_constants'
import Nav from './Nav'

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  LineController,
  BarController
)

// Chart.js global defaults
defaults.font.family = `'Sharp Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
defaults.animation = { easing: 'easeInOutQuart', duration: 1000 }

export default function Graph(): ReactElement {
  const { locale } = useUserPreferences()
  const { price, ddo, refreshInterval } = useAsset()
  const darkMode = useDarkMode(false, darkModeConfig)

  const [options, setOptions] = useState<ChartOptions>()
  const [graphType, setGraphType] = useState<GraphType>('liquidity')
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(true)
  const [dataHistory, setDataHistory] = useState<PoolHistory>()
  const [graphData, setGraphData] = useState<ChartData>()
  const [graphFetchInterval, setGraphFetchInterval] = useState<NodeJS.Timeout>()

  // Helper: fetch pool snapshots data
  const fetchPoolHistory = useCallback(async () => {
    try {
      const queryResult: OperationResult<PoolHistory> = await fetchData(
        poolHistoryQuery,
        { id: price.address.toLowerCase() },
        getQueryContext(ddo.chainId)
      )
      setDataHistory(queryResult?.data)
      setIsLoading(false)

      LoggerInstance.log(
        `[pool graph] Fetched pool snapshots:`,
        queryResult?.data
      )
    } catch (error) {
      LoggerInstance.error('[pool graph] Error fetchData: ', error.message)
      setError(error)
    }
  }, [ddo?.chainId, price?.address])

  // Helper: start interval fetching
  const initFetchInterval = useCallback(() => {
    if (graphFetchInterval) return

    const newInterval = setInterval(() => {
      fetchPoolHistory()
      LoggerInstance.log(
        `[pool graph] Refetch interval fired after ${refreshInterval / 1000}s`
      )
    }, refreshInterval)
    setGraphFetchInterval(newInterval)
  }, [fetchPoolHistory, graphFetchInterval, refreshInterval])

  useEffect(() => {
    return () => clearInterval(graphFetchInterval)
  }, [graphFetchInterval])

  //
  // 0 Get Graph options
  //
  useEffect(() => {
    LoggerInstance.log('[pool graph] Fired getOptions() for color scheme.')
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value])

  //
  // 1 Fetch all the data on mount
  // All further effects depend on the fetched data
  // and only do further data checking and manipulation.
  //
  useEffect(() => {
    fetchPoolHistory()
    initFetchInterval()
  }, [fetchPoolHistory, initFetchInterval])

  //
  // 2 Data manipulation
  //
  useEffect(() => {
    if (!dataHistory?.poolSnapshots) return

    const timestamps = dataHistory.poolSnapshots.map((item) => {
      const date = new Date(item.date * 1000)
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    })

    let baseTokenLiquidityCumulative = '0'
    const liquidityHistory = dataHistory.poolSnapshots.map((item) => {
      baseTokenLiquidityCumulative = new Decimal(baseTokenLiquidityCumulative)
        .add(item.baseTokenLiquidity)
        .toString()
      return baseTokenLiquidityCumulative
    })

    const priceHistory = dataHistory.poolSnapshots.map((item) => item.spotPrice)

    let volumeCumulative = '0'
    const volumeHistory = dataHistory.poolSnapshots.map((item) => {
      volumeCumulative = new Decimal(volumeCumulative)
        .add(item.swapVolume)
        .toString()
      return baseTokenLiquidityCumulative
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
    LoggerInstance.log('[pool graph] New graph data:', newGraphData)
  }, [dataHistory?.poolSnapshots, graphType])

  return (
    <div className={styles.graphWrap}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <small>{error.message}</small>
      ) : (
        <>
          <Nav graphType={graphType} setGraphType={setGraphType} />

          <Chart
            type={graphType === 'volume' ? 'bar' : 'line'}
            width={416}
            height={80}
            data={graphData}
            options={options}
            redraw
          />
        </>
      )}
    </div>
  )
}
