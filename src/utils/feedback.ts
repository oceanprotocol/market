export const feedback: { [key in number]: string } = {
  99: 'Decrypting file URL...',
  0: '1/3 Looking for data token. Buying if none found...',
  1: '2/3 Transfering data token.',
  2: '3/3 Payment confirmed. Requesting access...'
}

export const publishFeedback: { [key in number]: string } = {
  0: '1/5 Creating datatoken ...',
  2: '2/5 Encrypting files ...',
  4: '3/5 Storing ddo ...',
  6: '4/5 Minting tokens ...',
  8: '5/5 Asset published succesfully'
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

export function getCreatePricingPoolFeedback(
  dtSymbol: string
): { [key: number]: string } {
  return {
    99: `Minting ${dtSymbol} ...`,
    0: 'Creating pool ...',
    1: `Approving ${dtSymbol} ...`,
    2: 'Approving OCEAN ...',
    3: 'Setup pool ...',
    4: 'Pool created.'
  }
}

export function getCreatePricingExchangeFeedback(
  dtSymbol: string
): { [key: number]: string } {
  return {
    99: `Minting ${dtSymbol} ...`,
    0: 'Creating exchange ...',
    1: `Approving ${dtSymbol} ...`,
    2: 'Fixed exchange created.'
  }
}

export function getCreateFreePricingFeedback(
  dtSymbol: string
): { [key: number]: string } {
  return {
    99: `Creating ${dtSymbol} faucet...`,
    0: 'Setting faucet as minter ...',
    1: 'Approving minter...',
    2: 'Faucet created.'
  }
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
