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
import getAddressesForMain from '../../../../utils/getAddressesForMain'
import { gql, useQuery } from '@apollo/client'
import {
  PoolHistory,
  PoolHistory_pool_transactions
} from './__generated__/PoolHistory'

declare type GraphType = 'liquidity' | 'price'
declare type GraphData = {
  timestamps: string[]
  values: number[]
}
// Chart.js global defaults
defaults.global.defaultFontFamily = `'Sharp Sans', -apple-system, BlinkMacSystemFont,
'Segoe UI', Helvetica, Arial, sans-serif`
defaults.global.animation = { easing: 'easeInOutQuart', duration: 800 }

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

function constructGraphData(
  data: PoolHistory,
  graphType: GraphType
): ChartData {
  let graphData
  switch (graphType) {
    case 'liquidity': {
      graphData = data.pool.transactions.reduce<GraphData>(
        (result: GraphData, currentItem: PoolHistory_pool_transactions) => {
          // convert timestamps from epoch to locale date & time string
          if (currentItem.tokens.length > 0) {
            const date = new Date(currentItem.timestamp * 1000)
            result.timestamps.push(
              `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
            )
            result.values.push(Number(currentItem.tokens[0].tokenReserve))
          }

          return result
        },
        { timestamps: [], values: [] }
      )
      break
    }
    case 'price': {
      graphData = data.pool.transactions.reduce<GraphData>(
        (result: GraphData, currentItem: PoolHistory_pool_transactions) => {
          // convert timestamps from epoch to locale date & time string

          const date = new Date(currentItem.timestamp * 1000)
          result.timestamps.push(
            `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          )
          result.values.push(Number(currentItem.spotPrice))

          return result
        },
        { timestamps: [], values: [] }
      )
      break
    }
  }
  return {
    labels: graphData.timestamps,
    datasets: [
      {
        ...lineStyle,
        label: 'Liquidity (OCEAN)',
        data: graphData.values,
        borderColor: `#8b98a9`,
        pointBackgroundColor: `#8b98a9`
      }
    ]
  }
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
  query PoolHistory($id: ID!, $poolToken: String!) {
    pool(id: $id) {
      transactions(orderBy: timestamp) {
        spotPrice
        timestamp
        tokens(where: { poolToken: $poolToken }) {
          tokenReserve
        }
      }
    }
  }
`

export default function Graph(): ReactElement {
  const { locale } = useUserPreferences()
  const darkMode = useDarkMode(false, darkModeConfig)

  const [graphData, setGraphData] = useState<ChartData>()
  const [options, setOptions] = useState<ChartOptions>()
  const [graphType, setGraphType] = useState<GraphType>('liquidity')

  const { price } = useAsset()

  const { data } = useQuery<PoolHistory>(poolHistory, {
    variables: {
      id: price.address.toLowerCase(),
      poolToken: `${price.address.toLowerCase()}-${getAddressesForMain().oceanTokenAddress.toLowerCase()}`
    },
    pollInterval: 5000
  })

  useEffect(() => {
    Logger.log('Fired GraphOptions!')
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value])

  useEffect(() => {
    if (!data) return
    Logger.log('Fired GraphData!')
    const graphData = constructGraphData(data, graphType)
    setGraphData(graphData)
  }, [data, graphType])

  function handleGraphTypeSwitch(e: ChangeEvent<HTMLButtonElement>) {
    e.preventDefault()
    setGraphType(e.currentTarget.textContent.toLowerCase() as GraphType)
  }

  return (
    <div className={styles.graphWrap}>
      {graphData ? (
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
      ) : (
        <Loader />
      )}
    </div>
  )
}
