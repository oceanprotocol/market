export function prettySize(
  bytes: number,
  separator = ' ',
  postFix = ''
): string {
  if (!bytes) return 'n/a'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes.length - 1
  )
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)}${separator}${
    sizes[i]
  }${postFix}`
}
