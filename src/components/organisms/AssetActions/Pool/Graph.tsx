import React, { ReactElement, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  ChartData,
  ChartDataSets,
  ChartOptions,
  ChartTooltipItem,
  ChartTooltipOptions
} from 'chart.js'
import axios from 'axios'
import { useOcean } from '@oceanprotocol/react'
import styles from './Graph.module.css'
import Loader from '../../../atoms/Loader'
import { formatPrice } from '../../../atoms/Price/PriceUnit'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import useDarkMode from 'use-dark-mode'
import { darkModeConfig } from '../../../../../app.config'

const cumulativeSum = ((sum) => (value: any) => (sum += value[0]))(0)

const lineStyle: Partial<ChartDataSets> = {
  fill: false,
  lineTension: 0.1,
  borderWidth: 2,
  pointBorderWidth: 0,
  pointRadius: 0,
  pointHoverRadius: 3,
  pointHitRadius: 4
}

const tooltipOptions: Partial<ChartTooltipOptions> = {
  intersect: false,
  backgroundColor: `#303030`,
  titleFontColor: `#e2e2e2`,
  titleFontFamily: `'Sharp Sans', -apple-system, BlinkMacSystemFont,
  'Segoe UI', Helvetica, Arial, sans-serif`,
  titleFontStyle: 'normal',
  titleFontSize: 10,
  bodyFontFamily: `'Sharp Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Helvetica, Arial, sans-serif`,
  bodyFontColor: `#fff`,
  bodyFontSize: 12,
  bodyFontStyle: 'bold',
  displayColors: false,
  xPadding: 5,
  yPadding: 5,
  cornerRadius: 3
}

function constructGraphData(data: {
  ocean: ChartData[]
  datatoken: ChartData[]
}): ChartData {
  const labelsOcean = data.ocean.map((item: any) => item[1])

  console.log(labelsOcean)
  const dataValuesOcean = data.ocean.map(cumulativeSum)

  const labelsDt = data.datatoken.map((item: any) => new Date(item[1]))
  const dataValuesDt = data.datatoken.map(cumulativeSum)

  return {
    labels: labelsOcean,
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
    tooltips: {
      ...tooltipOptions,
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
  poolAddress
}: {
  poolAddress: string
}): ReactElement {
  const { config } = useOcean()
  const { locale } = useUserPreferences()
  const darkMode = useDarkMode(false, darkModeConfig)
  const [data, setData] = useState<ChartData>()

  useEffect(() => {
    const url = `${config.metadataCacheUri}/api/v1/aquarius/pools/history/${poolAddress}`

    async function getData() {
      try {
        const response = await axios(url)
        const graphData = constructGraphData(response.data)
        setData(graphData)
      } catch (error) {
        console.error(error.message)
      }
    }

    getData()
  }, [config.metadataCacheUri, poolAddress])

  return (
    <div className={styles.graphWrap}>
      {data ? (
        <Line
          height={70}
          data={data}
          options={getOptions(locale, darkMode.value)}
        />
      ) : (
        <Loader />
      )}
    </div>
  )
}
