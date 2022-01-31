import { formatPrice } from '@shared/Price/PriceUnit'
import { ChartOptions, TooltipItem } from 'chart.js'
import { tooltipOptions } from './_constants'

export function getOptions(locale: string, isDarkMode: boolean): ChartOptions {
  return {
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 20
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
      y: { display: false, beginAtZero: true },
      x: { display: false, offset: true }
    }
  }
}
