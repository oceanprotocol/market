// TODO: can be better
export function getOrderFeedback(
  baseTokenSymbol: string,
  datatokenSymbol: string
): { [key in number]: string } {
  return {
    0: `Approving and buying one ${datatokenSymbol} from pool`,
    1: `Ordering asset`,
    2: `Approving ${baseTokenSymbol} and ordering asset`,
    3: 'Generating signature to access download url'
  }
}

export function getComputeFeedback(
  baseTokenSymbol?: string,
  datatokenSymbol?: string,
  assetType?: string
): { [key in number]: string } {
  return {
    0: `Setting price and fees for ${assetType}`,
    1: `Approving ${datatokenSymbol} and ordering ${assetType} `,
    2: `Approving ${baseTokenSymbol} and ordering ${assetType}`,
    3: `Ordering ${assetType}`,
    4: 'Generating signature. Starting compute job ...'
  }
}
