import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  BarElement,
  LineElement,
  LineController,
  BarController,
  ChartDataset,
  TooltipOptions,
  defaults
} from 'chart.js'
import { gql } from 'urql'

export declare type GraphType = 'liquidity' | 'price' | 'volume'

export const graphTypes = ['Liquidity', 'Price', 'Volume']

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

// Chart.js global defaults
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  LineController,
  BarController
)

defaults.font.family = `'Sharp Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
defaults.animation = { easing: 'easeInOutQuart', duration: 1000 }

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
