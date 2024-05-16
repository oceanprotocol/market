// TODO: can be better
export function getOrderFeedback(
  baseTokenSymbol: string,
  datatokenSymbol: string
): { [key in number]: string } {
  return {
    0: `Approving and buying one ${datatokenSymbol}`,
    1: `Ordering asset`,
    2: `Approving ${baseTokenSymbol} and ordering asset`,
    3: 'Generating signature to access download url'
  }
}
