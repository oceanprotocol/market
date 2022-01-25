import { formatPrice } from '@shared/Price/PriceUnit'
import {
  ChartDataset,
  TooltipOptions,
  ChartOptions,
  TooltipItem
} from 'chart.js'
import { gql } from 'urql'

export declare type GraphType = 'liquidity' | 'price' | 'volume'

export const poolHistoryQuery = gql`
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

export const lineStyle: Partial<ChartDataset> = {
  fill: false,
  borderWidth: 2,
  pointBorderWidth: 0,
  pointRadius: 0,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 0,
  pointHitRadius: 2,
  pointHoverBackgroundColor: '#ff4092'
}

export const tooltipOptions: Partial<TooltipOptions> = {
  intersect: false,
  displayColors: false,
  padding: 10,
  cornerRadius: 3,
  borderWidth: 1,
  caretSize: 7
}

export function getOptions(locale: string, isDarkMode: boolean): ChartOptions {
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

export const graphTypes = ['Liquidity', 'Price', 'Volume']
