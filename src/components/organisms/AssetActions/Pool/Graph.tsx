import React, { ReactElement, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { ChartData, ChartTooltipItem } from 'chart.js'
import axios from 'axios'
import { useOcean } from '@oceanprotocol/react'

function constructGraphData(data: ChartData[]): ChartData {
  const labels = data.map((item: any) => new Date(item[0]))
  const dataValues = data.map((item: any) => item[1])

  return {
    labels,
    datasets: [
      {
        data: dataValues,
        fill: true,
        lineTension: 0.1,
        backgroundColor: `#e2e2e2`,
        borderColor: `#ff4092`,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        pointBackgroundColor: `#ff4092`,
        pointBorderWidth: 0,
        pointRadius: 1,
        pointHoverRadius: 5,
        pointHitRadius: 10
      }
    ]
  }
}

const options = {
  tooltips: {
    backgroundColor: `#141414`,
    titleFontColor: `#e2e2e2`,
    titleFontFamily: '1rem',
    titleFontStyle: '500',
    bodyFontFamily: `'Sharp Sans Display', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Helvetica, Arial, sans-serif`,
    bodyFontColor: `#fff`,
    bodyFontSize: 14,
    displayColors: false,
    xPadding: 10,
    yPadding: 10,
    cornerRadius: 3,
    callbacks: {
      label: (tooltipItem: ChartTooltipItem) => `$ ${tooltipItem.yLabel}`
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
        const graphData = constructGraphData(response.data.ocean)
        setData(graphData)
      } catch (error) {
        console.error(error.message)
      }
    }

    getData()
  }, [config.metadataCacheUri, poolAddress])

  return data ? <Line height={70} data={data} options={options} /> : null
}
