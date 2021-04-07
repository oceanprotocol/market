import React, { ReactElement, useState, useEffect } from 'react'

import { Line, defaults } from 'react-chartjs-2'
import {
  ChartData,
  ChartDataSets,
  ChartOptions,
  ChartTooltipOptions
} from 'chart.js'

import { useUserPreferences } from './../../../providers/UserPreferences'
import { darkModeConfig } from './../../../../app.config'
import useDarkMode from 'use-dark-mode'

import styles from './index.module.css'
import moment from 'moment'
import fetch from 'cross-fetch'

import { fetchData } from './../../../utils'
import useSWR, { mutate } from 'swr'
import axios from 'axios'

// Chart.js global defaults
defaults.global.defaultFontFamily = `'Sharp Sans', -apple-system, BlinkMacSystemFont,
'Segoe UI', Helvetica, Arial, sans-serif`
defaults.global.animation = { easing: 'easeInOutQuart', duration: 1000 }

const lineStyle: Partial<ChartDataSets> = {
  fill: true,
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
        top: 10,
        bottom: 0
      }
    },
    tooltips: {
      ...tooltipOptions,
      backgroundColor: isDarkMode ? `#141414` : `#fff`,
      titleFontColor: isDarkMode ? `#e2e2e2` : `#303030`,
      bodyFontColor: isDarkMode ? `#fff` : `#141414`,
      borderColor: isDarkMode ? `#41474e` : `#e2e2e2`
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

export default function StatsPage(): ReactElement {
  const { locale } = useUserPreferences()
  const darkMode = useDarkMode(false, darkModeConfig)
  const [options, setOptions] = useState<ChartOptions>()

  const [pageViewsStatData, setPageViewsStatData] = useState<ChartData>()
  const [pageViewsDate, setPageViewsDate] = useState<Array<string>>()
  const [pageViews, setPageViews] = useState<Array<number>>()

  const [visitorsStatData, setVisitorsStatData] = useState<ChartData>()
  const [uniqueVisitorsDate, setUniqueVisitorsDate] = useState<Array<string>>()
  const [uniqueVisitors, setUniqueVisitors] = useState<Array<number>>()

  const to = Date.now() // Current date and time in milliseconds
  const from = to - 2592000000 // The date and time (30 days ago) in milliseconds
  const resolution = 'day'

  const refreshInterval = 600000 // 10 min

  const pageViewsUrl = `https://market-stats-git-netlify-api-oceanprotocol.vercel.app/page-views?from=${from}&to=${to}&resolution=${resolution}`
  const visitorsUrl = `https://market-stats-git-netlify-api-oceanprotocol.vercel.app/visitors?from=${from}&to=${to}&resolution=${resolution}`

  const onSuccess = async (analyticsData, key: string, config) => {
    if (key.indexOf('page-views') < 0) {
      let dates: Array<string> = []
      let visitors: Array<number> = []

      analyticsData.data.forEach((stat: Array<number>) => {
        dates.push(moment(stat[0]).format('LL'))
        visitors.push(stat[1])
      })

      setUniqueVisitorsDate(dates)
      setUniqueVisitors(visitors)
    } else {
      let dates: Array<string> = []
      let views: Array<number> = []

      analyticsData.data.forEach((stat: Array<number>) => {
        dates.push(moment(stat[0]).format('LL'))
        views.push(stat[1])
      })

      setPageViewsDate(dates)
      setPageViews(views)
    }
  }

  useSWR(pageViewsUrl, fetchData, {
    refreshInterval,
    onSuccess
  })

  useSWR(visitorsUrl, fetchData, {
    refreshInterval,
    onSuccess
  })

  useEffect(() => {
    const options = getOptions(locale, darkMode.value)
    setOptions(options)
  }, [locale, darkMode.value])

  const pageViewsChartData: ChartData = {
    labels: pageViewsDate,
    datasets: [
      {
        ...lineStyle,
        label: 'Page Views',
        data: pageViews,
        borderColor: `#FE4494`,
        pointBackgroundColor: `#FE4494`,
        borderWidth: 1
      }
    ]
  }

  const uniqueVisitorsChartData: ChartData = {
    labels: uniqueVisitorsDate,
    datasets: [
      {
        ...lineStyle,
        label: 'Unique Visitors',
        data: uniqueVisitors,
        borderColor: `#FE4494`,
        pointBackgroundColor: `#FE4494`,
        borderWidth: 1
      }
    ]
  }

  return (
    <div>
      <div>
        <div>
          <div className={styles.pageViewsTitle}>Page views</div>
          <p>
            {moment(from).format('LL')} - {moment(to).format('LL')}
          </p>
        </div>
        <div className={styles.pageViewsChart}>
          <Line height={70} data={pageViewsChartData} options={options} />
        </div>
      </div>
      <div className={styles.chartSection}>
        <div>
          <div className={styles.pageViewsTitle}>Unique Visitors</div>
          <p>
            {moment(from).format('LL')} - {moment(to).format('LL')}
          </p>
        </div>
        <div className={styles.pageViewsChart}>
          <Line height={70} data={uniqueVisitorsChartData} options={options} />
        </div>
      </div>
    </div>
  )
}
