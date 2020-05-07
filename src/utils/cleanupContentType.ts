const cleanupContentType = (contentType: string) => {
  // strip away the 'application/' part
  const contentTypeSplit = contentType.split('/')[1]

  if (!contentTypeSplit) return contentType

  let contentTypeCleaned

  // TODO: add all the possible archive & compression MIME types
  switch (contentType) {
    case 'application/x-lzma':
    case 'application/x-xz':
    case 'application/x-tar':
    case 'application/x-gtar':
    case 'application/x-bzip2':
    case 'application/x-gzip':
    case 'application/x-7z-compressed':
    case 'application/x-rar-compressed':
    case 'application/x-zip-compressed':
    case 'application/x-apple-diskimage':
      contentTypeCleaned = contentTypeSplit
        .replace('x-', '')
        .replace('-compressed', '')
      break
    default:
      contentTypeCleaned = contentTypeSplit
      break
  }

  // Manual replacements
  contentTypeCleaned = contentTypeCleaned
    .replace('vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx')
    .replace('vnd.ms-excel', 'xls')
    .replace('apple-diskimage', 'dmg')
    .replace('octet-stream', 'Binary')
    .replace('svg+xml', 'svg')

  return contentTypeCleaned
}

export default cleanupContentType
