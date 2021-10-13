export function updateQueryStringParameter(
  uri: string,
  key: string,
  newValue: string
): string {
  const regex = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'

  if (uri.match(regex)) {
    return uri.replace(regex, '$1' + key + '=' + newValue + '$2')
  } else {
    return uri + separator + key + '=' + newValue
  }
}

export function prettySize(
  bytes: number,
  separator = ' ',
  postFix = ''
): string {
  if (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes.length - 1
    )
    return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)}${separator}${
      sizes[i]
    }${postFix}`
  }
  return 'n/a'
}

// Boolean value that will be true if we are inside a browser, false otherwise
export const isBrowser = typeof window !== 'undefined'

export function toStringNoMS(date: Date): string {
  return date.toISOString().replace(/\.[0-9]{3}Z/, 'Z')
}

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
