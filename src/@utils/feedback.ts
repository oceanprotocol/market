// TODO: can be better
export function getOrderFeedback(
  baseTokenSymbol: string,
  datatokenSymbol: string
): { [key in number]: string } {
  return {
    0: `Buying one ${datatokenSymbol} from pool`,
    1: `Approving ${baseTokenSymbol} and ordering asset`,
    2: 'Generating signature to access download url'
  }
}

// TODO: customize for compute
export const computeFeedback: { [key in number]: string } = {
  0: 'Ordering asset...',
  1: 'Transfering datatoken.',
  2: 'Access granted. Starting job...'
}
