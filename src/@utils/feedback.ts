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

export function getCollectTokensFeedback(
  baseTokenSymbol: string,
  baseTokenBalance: string
) {
  return `Collecting ${baseTokenBalance} ${baseTokenSymbol} from asset `
}

// TODO: customize for compute
export const computeFeedback: { [key in number]: string } = {
  0: 'Ordering asset...',
  1: 'Transfering datatoken.',
  2: 'Access granted. Starting job...'
}
