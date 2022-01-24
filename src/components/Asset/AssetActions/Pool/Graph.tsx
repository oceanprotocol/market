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
import { formatPrice } from '@shared/Price/PriceUnit'
import { useUserPreferences } from '@context/UserPreferences'
import useDarkMode from 'use-dark-mode'
import { darkModeConfig } from '../../../../../app.config'
import Button from '@shared/atoms/Button'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import { gql, OperationResult } from 'urql'
import { PoolHistory } from '../../../../@types/subgraph/PoolHistory'
import { fetchData, getQueryContext } from '@utils/subgraph'
import styles from './Graph.module.css'
import Decimal from 'decimal.js'

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  // Title,
  Tooltip,
  LineController,
  BarController
)

declare type GraphType = 'liquidity' | 'price' | 'volume'

// Chart.js global defaults
defaults.font.family = `'Sharp Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
defaults.animation = { easing: 'easeInOutQuart', duration: 1000 }

const REFETCH_INTERVAL = 10000

const lineStyle: Partial<ChartDataset> = {
  fill: false,
  borderWidth: 2,
  pointBorderWidth: 0,
  pointRadius: 0,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 0,
  pointHitRadius: 2,
  pointHoverBackgroundColor: '#ff4092'
}

const tooltipOptions: Partial<TooltipOptions> = {
  intersect: false,
  displayColors: false,
  padding: 10,
  cornerRadius: 3,
  borderWidth: 1,
  caretSize: 7
}

function getOptions(locale: string, isDarkMode: boolean): ChartOptions {
  return {
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 10
      }
    },
    plugins: {
      tooltip: {
        ...tooltipOptions,
        backgroundColor: isDarkMode ? `#141414` : `#fff`,
        titleColor: isDarkMode ? `#e2e2e2` : `#303030`,
        bodyColor: isDarkMode ? `#fff` : `#141414`,
        borderColor: isDarkMode ? `#41474e` : `#e2e2e2`,
        callbacks: {
          label: (tooltipItem: TooltipItem<any>) =>
            `${formatPrice(`${tooltipItem.formattedValue}`, locale)} OCEAN`
        }
      }
    },
    hover: { intersect: false },
    scales: {
      y: { display: false },
      x: { display: false }
    }
  }
}

const graphTypes = ['Liquidity', 'Price', 'Volume']

const poolHistoryQuery = gql`
  query PoolHistory($id: String!) {
    poolSnapshots(first: 1000, where: { pool: $id }, orderBy: date) {
      date
      spotPrice
      baseTokenLiquidity
      datatokenLiquidity
      swapVolume
    }
  }
`

export default function Graph(): ReactElement {
  const { locale } = useUserPreferences()
  const { price, ddo } = useAsset()
  const darkMode = useDarkMode(false, darkModeConfig)

  const [options, setOptions] = useState<ChartOptions>()
  const [graphType, setGraphType] = useState<GraphType>('liquidity')
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(true)
  const [dataHistory, setDataHistory] = useState<PoolHistory>()
  const [graphData, setGraphData] = useState<ChartData>()
  const [graphFetchInterval, setGraphFetchInterval] = useState<NodeJS.Timeout>()

  const getPoolHistory = useCallback(async () => {
    try {
      const queryResult: OperationResult<PoolHistory> = await fetchData(
        poolHistoryQuery,
        { id: price.address.toLowerCase() },
        getQueryContext(ddo.chainId)
      )
      setDataHistory(queryResult?.data)
    } catch (error) {
      console.error('Error fetchData: ', error.message)
      setError(error)
    }
  }, [ddo?.chainId, price?.address])

  const refetchGraph = useCallback(async () => {
    if (graphFetchInterval) return

    const newInterval = setInterval(() => getPoolHistory(), REFETCH_INTERVAL)
    setGraphFetchInterval(newInterval)
  }, [getPoolHistory, graphFetchInterval])

  useEffect(() => {
    LoggerInstance.log('Fired GraphOptions!')
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value])

  useEffect(() => {
    async function init() {
      if (!dataHistory) {
        await getPoolHistory()
        return
      }
      LoggerInstance.log('Fired GraphData!')

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

      const priceHistory = dataHistory.poolSnapshots.map(
        (item) => item.spotPrice
      )

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

      setGraphData({
        labels: timestamps.slice(0),
        datasets: [
          {
            ...lineStyle,
            label: 'Liquidity (OCEAN)',
            data,
            borderColor: `#8b98a9`
          }
        ]
      })
      setIsLoading(false)
      refetchGraph()
    }
    init()

    return () => clearInterval(graphFetchInterval)
  }, [dataHistory, graphType, graphFetchInterval, getPoolHistory, refetchGraph])

  function handleGraphTypeSwitch(e: ChangeEvent<HTMLButtonElement>) {
    e.preventDefault()
    setGraphType(e.currentTarget.textContent.toLowerCase() as GraphType)
  }

  return (
    <div className={styles.graphWrap}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <small>{error.message}</small>
      ) : (
        <>
          <nav className={styles.type}>
            {graphTypes.map((type: GraphType) => (
              <Button
                key={type}
                style="text"
                size="small"
                onClick={handleGraphTypeSwitch}
                className={`${styles.button} ${
                  graphType === type.toLowerCase() ? styles.active : null
                }`}
              >
                {type}
              </Button>
            ))}
          </nav>

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
