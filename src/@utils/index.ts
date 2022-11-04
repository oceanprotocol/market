import { Asset } from '@oceanprotocol/lib'

// Boolean value that will be true if we are inside a browser, false otherwise
export const isBrowser = typeof window !== 'undefined'

export function removeItemFromArray<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

export function sortAssets(items: Asset[], sorted: string[]) {
  items.sort(function (a, b) {
    return sorted?.indexOf(a.id) - sorted?.indexOf(b.id)
  })
  return items
}
