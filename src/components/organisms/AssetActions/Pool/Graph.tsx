/* eslint-disable camelcase */
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { Line, defaults } from 'react-chartjs-2'
import {
  ChartData,
  ChartDataSets,
  ChartOptions,
  ChartTooltipItem,
  ChartTooltipOptions
} from 'chart.js'
import styles from './Graph.module.css'
import Loader from '../../../atoms/Loader'
import { formatPrice } from '../../../atoms/Price/PriceUnit'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import useDarkMode from 'use-dark-mode'
import { darkModeConfig } from '../../../../../app.config'
import Button from '../../../atoms/Button'
import { Logger } from '@oceanprotocol/lib'
import { useAsset } from '../../../../providers/Asset'
import { gql, useQuery } from 'urql'
import { PoolHistory } from '../../../../@types/apollo/PoolHistory'

declare type GraphType = 'liquidity' | 'price'

// Chart.js global defaults
defaults.global.defaultFontFamily = `'Sharp Sans', -apple-system, BlinkMacSystemFont,
'Segoe UI', Helvetica, Arial, sans-serif`
defaults.global.animation = { easing: 'easeInOutQuart', duration: 1000 }

const lineStyle: Partial<ChartDataSets> = {
  fill: false,
  lineTension: 0.1,
  borderWidth: 2,
  pointBorderWidth: 0,
  pointRadius: 0,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 0,
  pointHitRadius: 2,
  pointHoverBackgroundColor: '#ff4092'
}

const tooltipOptions: Partial<ChartTooltipOptions> = {
  intersect: false,
  titleFontStyle: 'normal',
  titleFontSize: 10,
  bodyFontSize: 12,
  bodyFontStyle: 'bold',
  displayColors: false,
  xPadding: 10,
  yPadding: 10,
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
    tooltips: {
      ...tooltipOptions,
      backgroundColor: isDarkMode ? `#141414` : `#fff`,
      titleFontColor: isDarkMode ? `#e2e2e2` : `#303030`,
      bodyFontColor: isDarkMode ? `#fff` : `#141414`,
      borderColor: isDarkMode ? `#41474e` : `#e2e2e2`,
      callbacks: {
        label: (tooltipItem: ChartTooltipItem) =>
          `${formatPrice(`${tooltipItem.yLabel}`, locale)} OCEAN`
      }
    },
    legend: {
      display: false
    },
    hover: {
      intersect: false,
      animationDuration: 0
    },
    scales: {
      yAxes: [
        {
          display: false
          // gridLines: {
          //   drawBorder: false,
          //   color: isDarkMode ? '#303030' : '#e2e2e2',
          //   zeroLineColor: isDarkMode ? '#303030' : '#e2e2e2'
          // },
          // ticks: { display: false }
        }
      ],
      xAxes: [{ display: false, gridLines: { display: true } }]
    }
  }
}

const graphTypes = ['Liquidity', 'Price']

const poolHistory = gql`
  query PoolHistory($id: String!, $block: Int) {
    poolTransactions(
      first: 1000
      where: { poolAddress: $id, block_gt: $block }
      orderBy: block
    ) {
      block
      spotPrice
      timestamp
      oceanReserve
    }
  }
`

export default function Graph(): ReactElement {
  const { locale } = useUserPreferences()
  const darkMode = useDarkMode(false, darkModeConfig)
  const [options, setOptions] = useState<ChartOptions>()
  const [graphType, setGraphType] = useState<GraphType>('liquidity')

  const { price } = useAsset()

  const [lastBlock, setLastBlock] = useState<number>(0)
  const [priceHistory, setPriceHistory] = useState([])
  const [liquidityHistory, setLiquidityHistory] = useState([])
  const [timestamps, setTimestamps] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [graphData, setGraphData] = useState<ChartData>()

  const [result, refetch] = useQuery<PoolHistory>({
    query: poolHistory,
    variables: {
      id: price.address.toLowerCase(),
      block: lastBlock
    }
    // pollInterval: 20000
  })
  const { data, error } = result

  useEffect(() => {
    Logger.log('Fired GraphOptions!')
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value])

  useEffect(() => {
    if (!data) return
    Logger.log('Fired GraphData!')

    const latestTimestamps = [
      ...timestamps,
      ...data.poolTransactions.map((item) => {
        const date = new Date(item.timestamp * 1000)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      })
    ]
    setTimestamps(latestTimestamps)

    const latestLiquidtyHistory = [
      ...liquidityHistory,
      ...data.poolTransactions.map((item) => item.oceanReserve)
    ]

    setLiquidityHistory(latestLiquidtyHistory)

    const latestPriceHistory = [
      ...priceHistory,
      ...data.poolTransactions.map((item) => item.spotPrice)
    ]

    setPriceHistory(latestPriceHistory)

    if (data.poolTransactions.length > 0) {
      const newBlock =
        data.poolTransactions[data.poolTransactions.length - 1].block
      if (newBlock === lastBlock) return
      setLastBlock(
        data.poolTransactions[data.poolTransactions.length - 1].block
      )
      refetch()
    } else {
      setGraphData({
        labels: latestTimestamps.slice(0),
        datasets: [
          {
            ...lineStyle,
            label: 'Liquidity (OCEAN)',
            data:
              graphType === 'liquidity'
                ? latestLiquidtyHistory.slice(0)
                : latestPriceHistory.slice(0),
            borderColor: `#8b98a9`,
            pointBackgroundColor: `#8b98a9`
          }
        ]
      })
      setIsLoading(false)
    }
  }, [data, graphType])

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
          <Line height={70} data={graphData} options={options} />
        </>
      )}
    </div>
  )
}
