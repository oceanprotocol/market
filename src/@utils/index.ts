import { randomIntFromInterval } from './numbers'

// Boolean value that will be true if we are inside a browser, false otherwise
export const isBrowser = typeof window !== 'undefined'

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function removeItemFromArray<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

export function getRandomItemFromArray<T>(arr: Array<T>): T {
  return arr[randomIntFromInterval(0, arr.length - 1)]
}
