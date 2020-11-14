import React, { ReactElement, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  ChartData,
  ChartDataSets,
  ChartOptions,
  ChartTooltipItem
} from 'chart.js'
import axios from 'axios'
import { useOcean } from '@oceanprotocol/react'
import styles from './Graph.module.css'
import Loader from '../../../atoms/Loader'

const cumulativeSum = ((sum) => (value: any) => (sum += value[0]))(0)

const sharedStyle: Partial<ChartDataSets> = {
  fill: false,
  lineTension: 0.1,
  borderWidth: 1,
  pointBorderWidth: 0,
  pointRadius: 0,
  pointHoverRadius: 3,
  pointHitRadius: 2
}

function constructGraphData(data: {
  ocean: ChartData[]
  datatoken: ChartData[]
}): ChartData {
  const labelsOcean = data.ocean.map((item: any) => item[1])
  const dataValuesOcean = data.ocean.map(cumulativeSum)

  const labelsDt = data.datatoken.map((item: any) => new Date(item[1]))
  const dataValuesDt = data.datatoken.map(cumulativeSum)

  return {
    labels: labelsOcean,
    datasets: [
      {
        ...sharedStyle,
        label: 'Liquidity (OCEAN)',
        data: dataValuesOcean,
        borderColor: `#8b98a9`,
        pointBackgroundColor: `#8b98a9`
      }
      // {
      //   ...sharedStyle,
      //   label: 'Liquidity (Datatoken)',
      //   data: dataValuesDt,
      //   borderColor: `#7b1173`,
      //   pointBackgroundColor: `#7b1173`
      // }
    ]
  }
}

const options: ChartOptions = {
  spanGaps: true,
  tooltips: {
    backgroundColor: `#141414`,
    titleFontColor: `#e2e2e2`,
    titleFontFamily: '1rem',
    titleFontStyle: '500',
    bodyFontFamily: `'Sharp Sans Display', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Helvetica, Arial, sans-serif`,
    bodyFontColor: `#fff`,
    bodyFontSize: 11,
    displayColors: false,
    xPadding: 5,
    yPadding: 5,
    cornerRadius: 3,
    callbacks: {
      label: (tooltipItem: ChartTooltipItem) => `${tooltipItem.yLabel} OCEAN`
    }
  },
  legend: {
    display: false
  },
  scales: {
    yAxes: [{ display: false }],
    xAxes: [{ display: false }]
  }
}

export default function Graph({
  poolAddress
}: {
  poolAddress: string
}): ReactElement {
  const { config } = useOcean()
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
      {data ? <Line height={70} data={data} options={options} /> : <Loader />}
    </div>
  )
}
