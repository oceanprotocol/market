import React, { ReactElement, useEffect, useState } from 'react'
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

export interface ChartDataLiqudity {
  ocean: ChartData[]
  datatoken: ChartData[]
}

// This one-liner feels like magic.
// Stolen from https://stackoverflow.com/a/55261098/733677
const cumulativeSum = ((sum) => (value: any) => (sum += value[0]))(0)

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
  borderWidth: 1
}

function constructGraphData(data: ChartDataLiqudity): ChartData {
  const timestampsOcean = data.ocean.map((item: any) => {
    // convert timestamps from epoch to locale date & time string
    const date = new Date(item[1] * 1000)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  })
  const dataValuesOcean = data.ocean.map(cumulativeSum)

  // const timestampsDt = data.datatoken.map((item: any) => item[1])
  // const dataValuesDt = data.datatoken.map(cumulativeSum)

  return {
    labels: timestampsOcean,
    datasets: [
      {
        ...lineStyle,
        label: 'Liquidity (OCEAN)',
        data: dataValuesOcean,
        borderColor: `#8b98a9`,
        pointBackgroundColor: `#8b98a9`
      }
      // {
      //   ...lineStyle,
      //   label: 'Liquidity (Datatoken)',
      //   data: dataValuesDt,
      //   borderColor: `#7b1173`,
      //   pointBackgroundColor: `#7b1173`
      // }
    ]
  }
}

function getOptions(locale: string, isDarkMode: boolean): ChartOptions {
  return {
    // spanGaps: true,
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
          display: false,
          // gridLines: {
          //   drawBorder: false,
          //   color: isDarkMode ? '#303030' : '#e2e2e2',
          //   zeroLineColor: isDarkMode ? '#303030' : '#e2e2e2'
          // },
          ticks: { display: false }
        }
      ],
      xAxes: [{ display: false, gridLines: { display: true } }]
    }
  }
}

export default function Graph({
  data
}: {
  data: ChartDataLiqudity
}): ReactElement {
  const { locale } = useUserPreferences()
  const darkMode = useDarkMode(false, darkModeConfig)

  const [graphData, setGraphData] = useState<ChartData>()
  const [options, setOptions] = useState<ChartOptions>()

  useEffect(() => {
    console.log('Fired GraphOptions!')
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value])

  useEffect(() => {
    if (!data) return
    console.log('Fired GraphData!')
    const graphData = constructGraphData(data)
    setGraphData(graphData)
  }, [data])

  return (
    <div className={styles.graphWrap}>
      {graphData ? (
        <Line height={70} data={graphData} options={options} />
      ) : (
        <Loader />
      )}
    </div>
  )
}
