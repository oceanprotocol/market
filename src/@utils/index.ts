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

export const isPlainObject = (object: any) => {
  return object !== null && typeof object === 'object' && !Array.isArray(object)
}

export const getObjectPropertyByPath = (object: any, path = '') => {
  if (!isPlainObject(object)) return undefined
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  path = path.replace(/^\./, '') // strip a leading dot
  const pathArray = path.split('.')
  for (let i = 0, n = pathArray.length; i < n; ++i) {
    const key = pathArray[i]
    try {
      if (key in object) {
        object = object[key]
      } else {
        return undefined
      }
    } catch {
      return undefined
    }
  }
  return object
}
