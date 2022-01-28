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

export declare type GraphType = 'liquidity' | 'price' | 'volume'

export const graphTypes = ['Liquidity', 'Price', 'Volume']

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
  pointBorderWidth: 1,
  pointRadius: 2,
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
  caretSize: 7,
  bodyFont: {
    size: 13,
    weight: 'bold',
    lineHeight: 1,
    style: 'normal',
    family: defaults.font.family
  },
  titleFont: {
    size: 10,
    weight: 'normal',
    lineHeight: 1,
    style: 'normal',
    family: defaults.font.family
  }
}
