export function assetStateToString(state: number): string {
  switch (state) {
    case 0:
      return 'Active'
    case 1:
      return 'End-of-life'
    case 2:
      return 'Deprecated (by another asset)'
    case 3:
      return 'Revoked by publisher'
    case 4:
      return 'Ordering is temporary disabled'
    case 5:
      return 'Asset unlisted'

    default:
      break
  }
}

export function assetStateToNumber(state: string): number {
  switch (state) {
    case 'Active':
      return 0
    case 'End-of-life':
      return 1
    case 'Deprecated (by another asset)':
      return 2
    case 'Revoked by publisher':
      return 3
    case 'Ordering is temporary disabled':
      return 4
    case 'Asset unlisted':
      return 5

    default:
      break
  }
}
