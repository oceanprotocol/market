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

export interface ChartDataLiqudity {
  oceanAddRemove: ChartData[]
  datatokenAddRemove: ChartData[]
  oceanReserveHistory: ChartData[]
  datatokenReserveHistory: ChartData[]
  datatokenPriceHistory: ChartData[]
}

declare type GraphType = 'liquidity' | 'price'

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

function constructGraphData(data: ChartData[]): ChartData {
  const timestamps = data.map((item: any) => {
    // convert timestamps from epoch to locale date & time string
    const date = new Date(item[1] * 1000)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  })
  const values = data.map((item: any) => item[0])

  return {
    labels: timestamps,
    datasets: [
      {
        ...lineStyle,
        label: 'Liquidity (OCEAN)',
        data: values,
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

export default function Graph({
  data
}: {
  data: ChartDataLiqudity
}): ReactElement {
  const { locale } = useUserPreferences()
  const darkMode = useDarkMode(false, darkModeConfig)

  const [graphData, setGraphData] = useState<ChartData>()
  const [options, setOptions] = useState<ChartOptions>()
  const [graphType, setGraphType] = useState<GraphType>('liquidity')

  useEffect(() => {
    Logger.log('Fired GraphOptions!')
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value])

  useEffect(() => {
    if (!data) return
    Logger.log('Fired GraphData!')
    const graphData =
      graphType === 'liquidity'
        ? constructGraphData(data.oceanReserveHistory)
        : constructGraphData(data.datatokenPriceHistory)
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
