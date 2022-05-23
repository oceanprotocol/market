export const feedback: { [key in number]: string } = {
  99: 'Decrypting file URL...',
  0: '1/3 Looking for data token. Buying if none found...',
  1: '2/3 Transfering data token.',
  2: '3/3 Payment confirmed. Requesting access...'
}

// TODO: do something with this object,
// consumeStep should probably return one of those strings
// instead of just a number
export const consumeFeedback: { [key in number]: string } = {
  ...feedback,
  3: '3/3 Access granted. Consuming file...'
}

// TODO: customize for compute
export const computeFeedback: { [key in number]: string } = {
  0: '1/3 Ordering asset...',
  1: '2/3 Transfering data token.',
  2: '3/3 Access granted. Starting job...'
}

export function getBuyDTFeedback(dtSymbol: string): { [key: number]: string } {
  return {
    1: '1/3 Approving OCEAN ...',
    2: `2/3 Buying ${dtSymbol} ...`,
    3: `3/3 ${dtSymbol} bought.`
  }
}

export function getSellDTFeedback(dtSymbol: string): { [key: number]: string } {
  return {
    1: '1/3 Approving OCEAN ...',
    2: `2/3 Selling ${dtSymbol} ...`,
    3: `3/3 ${dtSymbol} sold.`
  }
}

export function getDispenseFeedback(dtSymbol: string): {
  [key: number]: string
} {
  return {
    1: `1/2 Requesting ${dtSymbol}...`,
    2: `2/2 Received ${dtSymbol}.`
  }
}
